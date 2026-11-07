# CodeCraftHub – Personalized Developer Learning Management Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop" alt="CodeCraftHub Banner" width="100%" style="border-radius: 12px; margin-bottom: 16px;" />
</p>

<p align="center">
  <strong>Learn Smarter. Build Better. Grow Faster.</strong>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v20%20%7C%20v22%20%7C%20v24-339933?logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-v19.3.1-61DAFB?logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 18" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white" alt="Express" /></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Vitest-98%20Passed-FCC72B?logo=vitest&logoColor=black" alt="Vitest Tests" /></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
</p>

---

## 🚀 Platform Overview

**CodeCraftHub** is an enterprise-grade, full-stack Developer Learning Management Platform (LMS) built with **React 19**, **Tailwind CSS v4**, **Node.js ES6+**, and **PostgreSQL 18**. Designed with a bespoke **Dark Navy & Electric Purple SaaS UI** (`#0B1020`, `#151C31`, `#7C5CFC`), it provides software engineering students, instructors, and platform administrators with an intuitive, telemetry-driven learning experience.

### Key Capabilities
- 🎓 **Interactive Learning Workspace:** Video player with timeline scrubber, syllabus sidebar, collapsible notes, and interactive code snippet sandbox with one-click copying.
- ⚡ **Automated Progress Triggers:** PostgreSQL database triggers automatically recalculate course completion percentages and trigger instant certificate generation upon syllabus completion.
- 🤖 **AI-Powered Skill Gap Analysis:** Analyzes learner competency against target career roles (e.g. *Full-Stack Engineer*, *Backend Architect*), calculating match scores and generating custom course tracks.
- 🏆 **Cryptographic Certificates:** Generates verifiable, SHA-256 hashed certificate credentials (`CCH-YYYY-XXXX-XXXX`) with a public verification portal.
- 👨‍🏫 **Instructor Studio:** Real-time revenue analytics, student enrollment counters, course authoring modal, and curriculum builder.
- 🛡️ **Administrator Governance:** System telemetry, real-time user role management, account suspension controls, and catalog publication overrides.
- 🔒 **Defense-in-Depth Security:** Multi-layered defense including Helmet HTTP security headers, CORS origin protection, JWT dual-token rotation, parameterized SQL queries, and strict input validation.

---

## 🏛️ Monorepo Architecture

```
CodeCraftHub/
├── backend/                       # Node.js + Express + PostgreSQL REST API
│   ├── database/
│   │   ├── migrations/            # 18 normalized relational SQL migrations
│   │   ├── seeds/                 # Realistic seed data (courses, lessons, reviews)
│   │   ├── init-db.js             # Database creation utility
│   │   ├── migrate.js             # Migration runner
│   │   ├── seed.js                # Seed data injector
│   │   └── reset.js               # Clean tear-down and rebuild
│   ├── scripts/
│   │   └── verify-env.js          # Pre-flight environment diagnostics
│   ├── src/
│   │   ├── config/                # Environment variables & pg.Pool configuration
│   │   ├── controllers/           # API handlers (auth, courses, progress, ai, admin)
│   │   ├── middleware/            # JWT auth, RBAC, error shielding, rate limiting
│   │   ├── models/                # Parameterized SQL data access layer
│   │   ├── routes/                # Versioned REST routers (/api/v1)
│   │   ├── services/              # AI recommendation engine & certificate generator
│   │   ├── utils/                 # Response envelopes & cryptographic helpers
│   │   ├── validators/            # Express Validator schema guards
│   │   ├── app.js                 # Express application orchestration
│   │   └── server.js              # Server boot & graceful shutdown hooks
│   ├── tests/                     # 98 Vitest & Supertest unit/integration tests
│   ├── Dockerfile                 # Multi-stage lean production Docker image
│   ├── ecosystem.config.cjs       # PM2 production cluster configuration
│   └── package.json
│
├── frontend/                      # React 19 + Vite + Tailwind CSS v4 SPA
│   ├── public/                    # Favicon and SVGs
│   ├── src/
│   │   ├── assets/                # Logos and illustrations
│   │   ├── components/            # Atomic design system (cards, badges, modals)
│   │   ├── contexts/              # AuthContext and NotificationContext
│   │   ├── hooks/                 # Custom React hooks (auth, courses, progress)
│   │   ├── layouts/               # DashboardLayout, AuthLayout
│   │   ├── pages/                 # Full application views (Catalog, Workspace, Dashboards)
│   │   ├── routes/                # ProtectedRoute and PublicOnlyRoute guards
│   │   ├── services/              # Axios API service clients
│   │   ├── utils/                 # Formatting & helper utilities
│   │   ├── App.jsx                # Route declarations
│   │   ├── index.css              # Custom Tailwind v4 theme tokens
│   │   └── main.jsx               # React 19 entry point
│   ├── Dockerfile                 # Multi-stage build + Nginx Alpine runner
│   ├── nginx.conf                 # SPA routing and API reverse-proxy configuration
│   └── package.json
│
├── docs/                          # Comprehensive Platform Documentation
│   ├── ARCHITECTURE.md            # System architecture, data flow & security model
│   ├── DATABASE_SCHEMA.md         # 18-table relational schema & ERD
│   ├── API_DOCUMENTATION.md       # Complete REST API specification
│   └── DEPLOYMENT_GUIDE.md        # Bare-metal PM2, Nginx & Docker deployment guide
│
├── docker-compose.yml             # Full-stack Docker orchestration
├── .env.production.example        # Production environment template
├── .gitignore                     # Git ignore rules
└── README.md                      # Project master documentation
```

---

## 🗺️ 13-Phase Engineering Roadmap (100% Completed)

- [x] **Phase 1: Project Setup & Environment Verification** — Monorepo scaffold, git repository, Tailwind CSS v4 theme design tokens, architecture documentation.
- [x] **Phase 2: PostgreSQL Database Architecture & Migrations** — 18 normalized tables, UUID primary keys, cascade rules, auto-sync enrollment triggers, seed datasets.
- [x] **Phase 3: Express Server Architecture & Middleware** — AppError hierarchy, standardized API response envelopes, rate limiting, CORS, `/api/v1/health` with DB latency probe.
- [x] **Phase 4: Authentication & Role-Based Authorization** — JWT access + refresh tokens, bcrypt password hashing, password reset workflow, RBAC (`student`, `instructor`, `admin`).
- [x] **Phase 5: Course & Lesson Management APIs** — Catalog search, category filters, difficulty tags, syllabus builder, preview video gating, automated duration calculation.
- [x] **Phase 6: Enrollment & Learning Progress APIs** — Safe enrollment transactions, lesson completion toggle with PostgreSQL trigger synchronization, 7-day telemetry, streaks.
- [x] **Phase 7: React Frontend Setup & Reusable UI Components** — React 19 + Tailwind v4 design system, `AuthContext`, atomic UI components, interactive living showcase at `/design-system`.
- [x] **Phase 8: Student Dashboard & Course Discovery** — KPI StatCards, Continue Learning hero card, Recharts weekly activity chart, dynamic catalog search, Course Details syllabus accordion.
- [x] **Phase 9: Learning Workspace & Progress Analytics** — Interactive video player, lesson navigation, code sandbox, course completion celebration modal, printable certificate modal.
- [x] **Phase 10: AI Recommendations & Personalized Learning** — Career role selector, readiness match meter, skill gap breakdown, catalog-grounded pathways, interactive technical explainer tutor.
- [x] **Phase 11: Instructor & Administrator Dashboards** — Instructor Studio (revenue, enrollment metrics, course creator modal, syllabus builder), Admin governance panel (user roles, account status, catalog publication override).
- [x] **Phase 12: Testing, Security Review & Bug Fixing** — 98 Vitest backend tests passing, 0 oxlint frontend errors, OWASP security review (SQL injection prevention, password masking, rate limiting).
- [x] **Phase 13: Documentation & Production Deployment Preparation** — REST API specification, bare-metal PM2 + Nginx guide, multi-stage Dockerfiles, Docker Compose stack.

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js:** v20.x, v22.x, or v24.x LTS
- **PostgreSQL:** v16+ (PostgreSQL 18 recommended) running on `localhost:5432`
- **Git**

---

### Method 1: Local Development Setup

#### 1. Configure Backend & Database
```powershell
# Navigate to backend directory
cd backend

# Copy environment template
cp .env.example .env
# Edit .env with your PostgreSQL credentials (default DB: codecrafthub_db, user: postgres)

# Install dependencies
npm install

# Initialize database, run migrations, and seed initial data
npm run db:setup

# Verify environment and database health
npm run verify:env

# Run automated tests
npm test

# Start backend server
npm run dev
```
The backend API will start at **`http://localhost:5000`** (Health: `http://localhost:5000/api/v1/health`).

#### 2. Configure Frontend
```powershell
# Open a new terminal in the frontend directory
cd frontend

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The React frontend will start at **`http://localhost:5173`**.

---

### Method 2: One-Click Docker Compose Setup

Run the entire platform (PostgreSQL 17, Backend API, and Frontend Nginx) with a single command:

```bash
# Copy production environment configuration
cp .env.production.example .env

# Build and launch all services
docker compose up -d --build

# View container status
docker compose ps
```
The platform is accessible at **`http://localhost`** (Frontend) and **`http://localhost:5000/api/v1`** (Backend).

---

## 🔑 Pre-Seeded Test Accounts

All pre-seeded development accounts share the password: **`Password123!`**

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@codecrafthub.dev` | `Password123!` | System telemetry, user governance, course publishing approval, full platform control. |
| **Instructor** | `sarah.dr@codecrafthub.dev` | `Password123!` | Instructor Studio, course authoring, curriculum builder, student enrollment stats. |
| **Instructor** | `alex.chen@codecrafthub.dev` | `Password123!` | Course management, syllabus builder, reviews analytics. |
| **Student** | `marcus.vance@gmail.com` | `Password123!` | Course catalog, interactive workspace, progress telemetry, certificates, AI recommendations. |
| **Student** | `elena.rostova@gmail.com` | `Password123!` | Course catalog, learning workspace, skill gap analysis. |

---

## 🧪 Verification & Automated Testing

### Backend Unit & Integration Tests (98 Tests)
```powershell
cd backend
npm test
```
```
 Test Files  9 passed (9)
      Tests  98 passed (98)
   Duration  3.08s
```

Test suites include:
- `tests/database.test.js`: PostgreSQL connection pool, table schema validation, cascade triggers.
- `tests/health.test.js`: Server health probe and database latency verification.
- `tests/middleware.test.js`: Rate limiting, AppError hierarchy, response envelopes.
- `tests/auth.test.js`: Registration, login, JWT rotation, password reset, RBAC checks.
- `tests/course.test.js`: Course search, filtering, syllabus structure, video preview lock gating.
- `tests/enrollment.test.js`: Course enrollment idempotency, progress tracking, trigger synchronization.
- `tests/ai.test.js`: Career role skill gap engine, readiness match calculation, grounded tutor explainer.
- `tests/admin_instructor.test.js`: Instructor course creation, admin telemetry, user status toggle.
- `tests/e2e.test.js`: 15-step end-to-end user lifecycle from student registration to course completion and certificate issuance.

### Frontend Production Build & Code Quality
```powershell
cd frontend

# Verify linter clean status (0 errors)
npm run lint

# Compile optimized production bundle
npm run build
```

---

## 📚 Platform Documentation Reference

For in-depth architectural and operational guides, consult the dedicated documentation files:
- 📐 [**System Architecture Specification**](file:///F:/CodeCraftHub/docs/ARCHITECTURE.md): Architectural design, security policies, token lifecycle, and data flow.
- 🗄️ [**Database Schema & ERD**](file:///F:/CodeCraftHub/docs/DATABASE_SCHEMA.md): Complete 18-table relational data dictionary and trigger specifications.
- 🔌 [**REST API Documentation**](file:///F:/CodeCraftHub/docs/API_DOCUMENTATION.md): Complete request/response schemas, query parameters, status codes, and error codes.
- 🚀 [**Production Deployment Guide**](file:///F:/CodeCraftHub/docs/DEPLOYMENT_GUIDE.md): Linux VPS setup, PM2 cluster scaling, Nginx reverse proxy configuration, SSL certificates, and Docker deployment.

---

## 📄 License & Attribution

This project is licensed under the **MIT License**.  
Developed with precision by the CodeCraftHub Engineering Team.
