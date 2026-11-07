# ===================================================
# CodeCraftHub Frontend - Production Dockerfile
# Multi-stage build: Vite compilation + Nginx Alpine
# ===================================================

# Stage 1: Build production static bundle
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve via high-performance Nginx Alpine
FROM nginx:1.27-alpine AS runner

# Replace default Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

