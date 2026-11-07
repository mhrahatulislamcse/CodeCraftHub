# CodeCraftHub – Production Deployment & Operations Guide

> **Target Platform:** Linux (Ubuntu 22.04 LTS / 24.04 LTS) or Containerized Cloud (AWS ECS, GCP Cloud Run, DigitalOcean, Kubernetes)  
> **Backend Runtime:** Node.js v20.x or v22.x+ LTS  
> **Database:** PostgreSQL 16.x – 18.x with connection pooling  
> **Frontend Engine:** Nginx Alpine serving React 19 production build  
> **Process Manager:** PM2 Cluster Mode or Docker Compose  

---

## 1. Production Architecture Overview

CodeCraftHub is engineered for high availability, low latency, and zero-downtime rolling deployments.

```
                              [ Internet / Clients ]
                                        │
                                        ▼ HTTPS (443)
                         ┌─────────────────────────────┐
                         │      Cloudflare / CDN       │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │     Nginx Reverse Proxy     │
                         │   (SSL Termination, Gzip)   │
                         └──────┬───────────────┬──────┘
                                │               │
          Static SPA Assets (/) │               │ Proxy API (/api/v1)
                                ▼               ▼
                      ┌──────────────────┐    ┌───────────────────────────┐
                      │ React 19 Build   │    │ PM2 Node.js Cluster       │
                      │ (Vite Static)    │    │ (Node.js v20/22+ ES Mod)  │
                      └──────────────────┘    └─────────────┬─────────────┘
                                                            │
                                              pg.Pool       ▼
                                              ┌───────────────────────────┐
                                              │ PostgreSQL 18             │
                                              │ (ACID, Triggers, Indexes) │
                                              └───────────────────────────┘
```

---

## 2. Infrastructure & System Prerequisites

### Minimum Hardware Sizing
- **Small (Dev/Staging, < 500 daily active users):** 1 vCPU, 2 GB RAM, 25 GB SSD.
- **Medium (Production Tier 1, up to 5,000 DAU):** 2 vCPU, 4 GB RAM, 50 GB NVMe.
- **Large (Production Tier 2, 25,000+ DAU):** 4 vCPU, 8 GB RAM, 100 GB NVMe, Managed PostgreSQL (e.g. AWS RDS or GCP Cloud SQL).

### Software Requirements
- **Operating System:** Ubuntu 22.04 LTS or 24.04 LTS
- **Node.js:** v20.18.0 LTS or v22.x LTS (`node -v`)
- **Package Manager:** `npm` v10+
- **PostgreSQL:** v16+ (PostgreSQL 18 recommended)
- **Nginx:** v1.18+ or latest stable
- **Docker & Docker Compose:** Docker Engine 24.0+, Compose v2.20+
- **Certbot:** For Let's Encrypt TLS certificates

---

## 3. Environment Variables Configuration

Both backend and frontend require environment configuration files before deployment.

### 3.1 Backend `.env.production`
Save in `backend/.env.production` (never commit secrets to version control):

```env
# Application Runtime
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1

# Frontend Origin for Strict CORS
CLIENT_URL=https://codecrafthub.dev

# Database Connection (Prefer connection URI for cloud deployments)
DATABASE_URL=postgresql://codecrafthub_app:SuperSecretDBPassword123!@127.0.0.1:5432/codecrafthub_db?sslmode=prefer
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=codecrafthub_db
DB_USER=codecrafthub_app
DB_PASSWORD=SuperSecretDBPassword123!
DB_SSL=false

# PostgreSQL Connection Pool Tuning
DB_POOL_MAX=25
DB_POOL_IDLE_TIMEOUT_MS=30000
DB_POOL_CONN_TIMEOUT_MS=5000

# Cryptographic Secrets (Generate with `openssl rand -hex 32`)
JWT_ACCESS_SECRET=c1f4e8b9392c019d84e9d567823abce128374950293847561029384756102938
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=7f9012384a839210bc9384756102938475610293847561029384756102938475
JWT_REFRESH_EXPIRY=7d
PASSWORD_RESET_SECRET=9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b

# Rate Limiting Controls
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=10

# Optional External AI API Key (Falls back to internal semantic heuristics)
OPENAI_API_KEY=
```

### 3.2 Frontend `.env.production`
Save in `frontend/.env.production`:

```env
VITE_API_BASE_URL=https://codecrafthub.dev/api/v1
VITE_APP_NAME=CodeCraftHub
VITE_APP_TAGLINE="Learn Smarter. Build Better. Grow Faster."
```

---

## 4. Production Database Setup & Migrations

### 4.1 Create Dedicated Production Role (Least-Privilege)
Never run the production application with the `postgres` superuser role.

```bash
# Connect as postgres superuser
sudo -u postgres psql

# In psql console:
CREATE USER codecrafthub_app WITH PASSWORD 'SuperSecretDBPassword123!';
CREATE DATABASE codecrafthub_db OWNER codecrafthub_app;
GRANT ALL PRIVILEGES ON DATABASE codecrafthub_db TO codecrafthub_app;
\q
```

### 4.2 Run Schema Migrations & Baseline Seeds
From the application backend directory:

```bash
cd /var/www/codecrafthub/backend

# Verify connection and configuration
NODE_ENV=production npm run verify:env

# Execute all versioned SQL migrations
NODE_ENV=production npm run db:migrate

# Optional: Seed initial tracks, categories, and master accounts
NODE_ENV=production npm run db:seed
```

---

## 5. Deployment Option A: Bare-Metal / VPS with PM2 & Nginx

This topology yields maximum raw performance on dedicated VPS instances (Linode, DigitalOcean, Hetzner, AWS EC2).

### 5.1 Step 1: Install & Configure PM2
PM2 manages Node.js processes, automatically balancing traffic across CPU cores with zero-downtime reloads.

Install PM2 globally:
```bash
sudo npm install -g pm2
```

We provide `backend/ecosystem.config.cjs` configured for production:
```bash
cd /var/www/codecrafthub/backend
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

Useful PM2 commands:
- Monitor live cluster: `pm2 monit`
- Reload with zero downtime: `pm2 reload codecrafthub-api`
- Tail logs: `pm2 logs codecrafthub-api`

### 5.2 Step 2: Build the React 19 Frontend
```bash
cd /var/www/codecrafthub/frontend
npm ci
npm run build
# Built artifacts will reside in /var/www/codecrafthub/frontend/dist
```

### 5.3 Step 3: Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/codecrafthub`:

```nginx
# Upstream PM2 Node cluster
upstream backend_cluster {
    server 127.0.0.1:5000 max_fails=3 fail_timeout=10s;
    keepalive 32;
}

# HTTP - Redirect all traffic to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name codecrafthub.dev www.codecrafthub.dev;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS - Production Server Block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name codecrafthub.dev www.codecrafthub.dev;

    # SSL Certificates (managed via Certbot)
    ssl_certificate /etc/letsencrypt/live/codecrafthub.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/codecrafthub.dev/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://api.codecrafthub.dev; frame-src 'self' https://www.youtube.com;" always;

    # Compression (Gzip)
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml image/svg+xml;

    # 1. API Reverse Proxy
    location /api/ {
        proxy_pass http://backend_cluster;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    # 2. Static Frontend Assets Cache
    location /assets/ {
        root /var/www/codecrafthub/frontend/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 3. Single-Page Application (SPA) HTML5 Routing
    location / {
        root /var/www/codecrafthub/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

Enable site and test configuration:
```bash
sudo ln -s /etc/nginx/sites-available/codecrafthub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5.4 Step 4: Let's Encrypt SSL with Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d codecrafthub.dev -d www.codecrafthub.dev
```

---

## 6. Deployment Option B: Docker & Docker Compose

For containerized cloud environments (AWS EC2, DigitalOcean Droplets, Kubernetes).

### 6.1 Architecture of the Docker Compose Stack
The root `docker-compose.yml` orchestrates three isolated services on a dedicated bridge network:
1. `postgres`: Official PostgreSQL 18 Alpine image with persistent named volume `cch_pgdata` and internal healthcheck.
2. `backend`: Node.js 24 Alpine multi-stage production image running the Express API.
3. `frontend`: High-performance Nginx Alpine image serving the optimized React 19 build and reverse-proxying `/api` requests.

### 6.2 Running with Docker Compose
```bash
# Clone repository
git clone https://github.com/codecrafthub/codecrafthub.git
cd codecrafthub

# Copy production environment template
cp .env.production.example .env

# Build and start all services in detached mode
docker compose up -d --build

# Inspect running containers
docker compose ps

# View live consolidated logs
docker compose logs -f backend
```

---

## 7. Automated Database Backups & Maintenance

Set up a daily cron task on Linux to snapshot PostgreSQL data.

Create `/usr/local/bin/backup-codecrafthub.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/codecrafthub"
DATE=$(date +\%Y\%m\%d_\%H\%M\%S)
FILENAME="${BACKUP_DIR}/codecrafthub_backup_${DATE}.sql.gz"

mkdir -p ${BACKUP_DIR}

pg_dump -U codecrafthub_app -h 127.0.0.1 codecrafthub_db | gzip > ${FILENAME}

# Retain only last 14 days of backups
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +14 -exec rm {} \;

echo "Backup completed: ${FILENAME}"
```

Make executable and add to crontab:
```bash
chmod +x /usr/local/bin/backup-codecrafthub.sh
# Run every night at 02:00 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-codecrafthub.sh > /dev/null 2>&1") | crontab -
```

---

## 8. Production Healthcheck & Monitoring Runbook

### Healthcheck URL
- **Endpoint:** `GET https://codecrafthub.dev/api/v1/health`
- **Expected Status:** HTTP `200 OK`
- **Acceptable DB Latency:** `< 20ms`

### Incident Response Runbook
1. **API returns 502 Bad Gateway:**
   - Check PM2: `pm2 status`
   - Restart cluster: `pm2 restart codecrafthub-api`
   - Inspect errors: `tail -n 100 /root/.pm2/logs/codecrafthub-api-error.log`
2. **Database connection timeout:**
   - Check PostgreSQL status: `sudo systemctl status postgresql`
   - Test socket: `pg_isready -h localhost -p 5432`
   - Inspect active connections: `SELECT count(*) FROM pg_stat_activity;`
3. **High memory alert:**
   - PM2 cluster automatically restarts worker threads if memory exceeds 500MB per instance (`max_memory_restart: '500M'`).
