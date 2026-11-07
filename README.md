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

## 📑 Table of Contents
1. [Platform Overview](#-platform-overview)
2. [Monorepo Architecture](#-monorepo-architecture)
3. [Full 13-Phase Engineering Process & Journey](#-full-13-phase-engineering-process--journey)
4. [Database Architecture & Migration Process](#-database-architecture--migration-process)
5. [Backend & Security Architecture Process](#-backend--security-architecture-process)
6. [Frontend Design System & UI Architecture Process](#-frontend-design-system--ui-architecture-process)
7. [AI Recommendation & Skill Gap Engine Process](#-ai-recommendation--skill-gap-engine-process)
8. [Testing & Quality Assurance Process](#-testing--quality-assurance-process)
9. [Pre-Seeded Test Accounts](#-pre-seeded-test-accounts)
10. [Quick Start & Local Execution](#-quick-start--local-execution)
11. [Production Deployment & Containerization](#-production-deployment--containerization)
12. [Git Workflow & Remote Repository Push](#-git-workflow--remote-repository-push)
13. [Platform Documentation Index](#-platform-documentation-index)

---

## 🚀 Platform Overview

**CodeCraftHub** is an enterprise-grade, full-stack Developer Learning Management Platform (LMS) engineered with **React 19**, **Tailwind CSS v4**, **Node.js ES6+ Modules**, and **PostgreSQL 18**. Designed with a bespoke **Dark Navy & Electric Purple SaaS UI** (`#0B1020`, `#151C31`, `#7C5CFC`), it provides software engineering students, instructors, and platform administrators with an intuitive, telemetry-driven learning experience.

### Core Value Propositions
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

## 🗺️ Full 13-Phase Engineering Process & Journey

Every phase was implemented with zero mocks, connecting real React 19 views to Node.js REST services and PostgreSQL 18:

### Phase 1: Project Setup & Environment Verification
- **Process & Deliverables:** Monorepo directory structure established (`backend/`, `frontend/`, `docs/`). Git repository initialized with strict production `.gitignore`. Tailwind CSS v4 design tokens configured with custom theme colors (`#0B1020`, `#151C31`, `#7C5CFC`). Created automated pre-flight environment verification script (`scripts/verify-env.js`).
- **Outcome:** Verified Node.js v24+, active PostgreSQL connectivity, and directory integrity.

### Phase 2: PostgreSQL Database Architecture & Migrations
- **Process & Deliverables:** Designed an 18-table relational schema using UUID primary keys, foreign key constraints with cascade rules, and automated timestamp triggers. Implemented the critical `trg_sync_enrollment_progress` trigger that auto-recalculates `progress_percentage` and auto-sets `completed_at` whenever a lesson is toggled. Created migration and seed scripts with 5 pre-seeded accounts and 6 multi-lesson courses.
- **Outcome:** Production database `codecrafthub_db` successfully created, migrated, and seeded.

### Phase 3: Express Server Architecture & Middleware
- **Process & Deliverables:** Built Express.js backend with ES6+ modules. Established custom `AppError` class hierarchy, deterministic API response envelope utilities (`sendSuccess`, `sendError`), IP-based rate limiting, Helmet HTTP security headers, CORS origin whitelist, and `/api/v1/health` with real-time PostgreSQL heartbeat query latency.
- **Outcome:** Central error handler traps all operational errors cleanly with zero process crashes.

### Phase 4: Authentication & Role-Based Authorization
- **Process & Deliverables:** Implemented stateless dual-token JWT authentication (15-minute access token, 7-day refresh token). Built user registration, login, logout, password change, and secure password reset workflows. Configured `authenticate` and `authorize(...roles)` middleware protecting routes by role (`student`, `instructor`, `admin`).
- **Outcome:** 16 Vitest authentication and authorization integration tests passing.

### Phase 5: Course and Lesson Management APIs
- **Process & Deliverables:** Engineered course catalog search with multi-parameter filtering (category, difficulty, search query, sorting by newest/popular/rating), dynamic pagination, syllabus builder, and video preview gating (locking non-preview video URLs for non-enrolled students).
- **Outcome:** 17 Vitest course catalog and syllabus tests passing.

### Phase 6: Enrollment and Learning Progress APIs
- **Process & Deliverables:** Developed course enrollment transactions with duplicate prevention, progress tracking per lesson, 7-day activity telemetry calculation, learning streak counters, and automatic cryptographic certificate generation upon course completion.
- **Outcome:** 13 Vitest enrollment and telemetry tests passing.

### Phase 7: React Frontend Setup and Reusable UI Components
- **Process & Deliverables:** Initialized React 19 + Vite frontend. Configured Tailwind CSS v4 design system tokens. Built reusable atomic UI components (`Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `Modal`, `ProgressBar`, `StatCard`, `CourseCard`, `Spinner`, `ToastContainer`), `DashboardLayout`, `AuthLayout`, route guards (`ProtectedRoute`, `PublicOnlyRoute`), and an interactive living showcase at `/design-system`.
- **Outcome:** Cohesive, premium dark navy SaaS interface.

### Phase 8: Student Dashboard and Course Discovery
- **Process & Deliverables:** Built student `Dashboard.jsx` (KPI StatCards, Continue Learning hero card, Recharts weekly activity bar chart, recommended tracks), `CourseCatalog.jsx` (instant search, dynamic category pills, difficulty filters, pagination), and `CourseDetails.jsx` (syllabus accordion, learning objectives, instructor card, enrollment CTA).
- **Outcome:** Full discovery and enrollment student workflow.

### Phase 9: Learning Workspace and Progress Analytics
- **Process & Deliverables:** Constructed `LearningWorkspace.jsx` (custom interactive video player, timeline scrubber, lesson navigation, "Mark as Complete" toggles, code snippet sandbox with syntax highlighting and copy button, course completion modal) and `MyLearning.jsx` (In Progress, Completed, and Certificates tabs; official printable certificate modal).
- **Outcome:** Immersive developer learning classroom.

### Phase 10: AI-Powered Recommendations & Skill Gap Engine
- **Process & Deliverables:** Developed `aiService.js` and `aiController.js` with career role skill gap analysis, match percentage meter, grounded course pathways persisted in `ai_recommendations`, and an interactive technical concept tutor. Built `AIRecommendations.jsx` frontend view with interactive role switching and chat.
- **Outcome:** 9 Vitest AI recommendation tests passing.

### Phase 11: Instructor and Administrator Dashboards
- **Process & Deliverables:** Built instructor studio endpoints (`/courses/instructor/my-courses`, `/courses/instructor/analytics`) and admin governance endpoints (`/admin/stats`, `/admin/users`, `/admin/users/:id/role`, `/admin/users/:id/status`, `/admin/courses/:id/publish`). Created `InstructorDashboard.jsx` (KPIs, course creator modal, syllabus builder) and `AdminDashboard.jsx` (telemetry, user governance table with role switcher and status toggle, catalog publication override).
- **Outcome:** 10 Vitest admin/instructor tests passing.

### Phase 12: End-to-End Integration, Security Review & Testing
- **Process & Deliverables:** Conducted OWASP security audit (SQL injection prevention, password masking, RBAC boundaries, rate limiting, error shielding). Cleaned frontend linter with `oxlint` (0 errors). Wrote a 15-step comprehensive end-to-end integration test suite (`tests/e2e.test.js`) simulating student registration through course completion and certificate issuance.
- **Outcome:** 98 Vitest tests passing across all 9 test suites in 2.88s.

### Phase 13: Documentation & Production Deployment Preparation
- **Process & Deliverables:** Authored `docs/API_DOCUMENTATION.md` (32 endpoints with request/response schemas), `docs/DEPLOYMENT_GUIDE.md` (PM2 cluster, Nginx reverse proxy, Let's Encrypt SSL, automated backups), multi-stage `Dockerfile` for backend and frontend, `docker-compose.yml`, and `backend/ecosystem.config.cjs`.
- **Outcome:** Full production readiness with containerized and bare-metal support.

---

## 🗄️ Database Architecture & Migration Process

CodeCraftHub uses a normalized relational architecture across **18 tables** in PostgreSQL 18.

### Database Migration Process
Migrations are located in `backend/database/migrations/` and executed sequentially:
```bash
cd backend
npm run db:migrate
```
To completely reset and reseed the database:
```bash
npm run db:reset
npm run db:setup
```

### Relational Schema Diagram (Core Entities)
```
  ┌────────────────────────┐         ┌────────────────────────┐
  │         users          │ 1     * │        courses         │
  │────────────────────────│─────────│────────────────────────│
  │ id (UUID, PK)          │         │ id (UUID, PK)          │
  │ email (VARCHAR, Unique)│         │ instructor_id (FK)     │
  │ password_hash (VARCHAR)│         │ title (VARCHAR)        │
  │ role (ENUM)            │         │ slug (VARCHAR, Unique) │
  │ status (ENUM)          │         │ is_published (BOOLEAN) │
  └───────────┬────────────┘         └───────────┬────────────┘
              │ 1                                │ 1
              │                                  │
              │ *                                │ *
  ┌───────────▼────────────┐         ┌───────────▼────────────┐
  │      enrollments       │ *     1 │        lessons         │
  │────────────────────────│─────────│────────────────────────│
  │ id (UUID, PK)          │         │ id (UUID, PK)          │
  │ user_id (UUID, FK)     │         │ course_id (UUID, FK)   │
  │ course_id (UUID, FK)   │         │ title (VARCHAR)        │
  │ progress_percentage    │         │ order_index (INTEGER)  │
  │ completed_at           │         │ is_preview (BOOLEAN)   │
  └───────────┬────────────┘         └───────────┬────────────┘
              │ 1                                │ 1
              │                                  │
              │ *                                │ *
  ┌───────────▼────────────┐         ┌───────────▼────────────┐
  │      certificates      │         │    lesson_progress     │
  │────────────────────────│         │────────────────────────│
  │ id (UUID, PK)          │         │ id (UUID, PK)          │
  │ certificate_code (UQ)  │         │ enrollment_id (FK)     │
  │ user_id (UUID, FK)     │         │ lesson_id (UUID, FK)   │
  │ course_id (UUID, FK)   │         │ is_completed (BOOLEAN) │
  └────────────────────────┘         └────────────────────────┘
```

### Automated Trigger Synchronization
The PostgreSQL trigger `trg_sync_enrollment_progress` executes after any insert or update on `lesson_progress`:
1. Calculates total lessons and completed lessons for the course.
2. Updates `enrollments.progress_percentage = (completed / total) * 100`.
3. If progress reaches 100%, sets `completed_at = CURRENT_TIMESTAMP` and issues a unique certificate code (`CCH-YYYY-XXXX-XXXX`).

---

## 🔒 Backend & Security Architecture Process

### Request Execution Pipeline
Every HTTP request follows a strict, defensive middleware chain:
```
Incoming HTTP Request
  │
  ▼ 1. Helmet HTTP Security Headers (HSTS, CSP, X-Frame-Options)
  ▼ 2. CORS Whitelist Verification (Restricted to CLIENT_URL)
  ▼ 3. Rate Limiter (200 req / 15m general, 10 req / 15m auth)
  ▼ 4. JSON & URL-encoded Body Parsers (10MB payload ceiling)
  ▼ 5. Morgan Request Logger
  ▼ 6. Versioned Route Router (/api/v1)
  │    ├── Request Input Validation (Express Validator)
  │    ├── JWT Authentication Guard (authenticate)
  │    ├── Role-Based Access Control (authorize('admin', 'instructor'))
  │    └── Controller & Parameterized Database Queries
  ▼ 7. 404 Route Not Found Shield
  ▼ 8. Centralized Global Error Handler (AppError Normalizer)
```

### Security Measures Implemented
- **Parameterized SQL Queries:** 100% of database queries use `$1, $2` parameters via `pg.Pool`.
- **Password Masking:** `password_hash` is stripped from all user objects before response serialization.
- **Dual JWT Rotation:** Short-lived access tokens (15m) paired with refresh tokens (7d) prevents session hijacking.
- **Input Sanitization:** Express-validator validates types, lengths, and formats on all inputs.

---

## 🎨 Frontend Design System & UI Architecture Process

The frontend is built with **React 19** and **Tailwind CSS v4** adhering to the Figma Master Design Specification:

### Design Tokens
| Token | Hex Value | Application |
| :--- | :--- | :--- |
| **Primary Background** | `#0B1020` | Main application shell and layout backdrop |
| **Surface Card** | `#151C31` | Cards, modals, sidebars, elevated panels |
| **Input Background** | `#10182B` | Form fields, search bars, code editor backdrop |
| **Border Muted** | `#27324A` | Card borders, dividers, table borders |
| **Electric Purple** | `#7C5CFC` | Primary CTA buttons, active tabs, progress bars |
| **Lavender Accent** | `#A78BFA` | Badges, secondary highlights, icons |
| **Primary Text** | `#F8FAFC` | Headings, active menu labels, high-contrast text |
| **Muted Text** | `#94A3B8` | Subtitles, metadata, timestamps |

### UI Component Architecture
- **Atomic Components:** `Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `Modal`, `ProgressBar`, `StatCard`, `CourseCard`, `Spinner`, `ToastContainer`.
- **Layout Engines:** `DashboardLayout` (responsive collapsible sidebar, user dropdown, notifications) and `AuthLayout` (branding hero split-screen).
- **Route Guards:** `ProtectedRoute` (verifies token and checks required role permissions) and `PublicOnlyRoute` (redirects logged-in users to dashboard).
- **Interactive Living Showcase:** Accessible at `/design-system` demonstrating all components and states.

---

## 🤖 AI Recommendation & Skill Gap Engine Process

The CodeCraftHub AI Engine evaluates developer competencies to create customized learning roadmaps:
1. **Target Role Mapping:** Compares user's completed lessons against role competency matrices (*Full-Stack Developer*, *Backend Engineer*, *DevOps Specialist*).
2. **Match Score Algorithm:** Calculates a percentage readiness score based on core vs optional skill attainment.
3. **Missing Competencies Identification:** Identifies exact gaps (e.g. *PostgreSQL Optimization*, *Docker Containers*) and recommends specific courses from the catalog.
4. **Interactive Concept Tutor:** Context-grounded technical explainer answering engineering questions with formatted markdown and syntax-highlighted code snippets.
5. **Zero-Dependency Fallback:** If an external `OPENAI_API_KEY` is not supplied, the engine uses intelligent semantic heuristics, ensuring 100% uptime without failing.

---

## 🧪 Testing & Quality Assurance Process

### 98 Passing Tests Across 9 Test Suites
All backend functionality is verified using Vitest and Supertest:

```powershell
cd backend
npm test
```
```
 RUN  v3.2.7 F:/CodeCraftHub/backend

 ✓ tests/database.test.js (5 tests)         # Connection pooling, schemas, triggers
 ✓ tests/health.test.js (3 tests)           # Heartbeat probe & DB query latency
 ✓ tests/middleware.test.js (10 tests)      # Rate limiting, envelopes, AppError
 ✓ tests/ai.test.js (9 tests)               # Skill gap analysis, grounded explainer
 ✓ tests/enrollment.test.js (13 tests)      # Enrollment idempotency, trigger sync
 ✓ tests/admin_instructor.test.js (10 tests)# Studio analytics, user status toggle
 ✓ tests/e2e.test.js (15 tests)             # 15-step end-to-end student lifecycle
 ✓ tests/course.test.js (17 tests)          # Catalog search, syllabus, preview gating
 ✓ tests/auth.test.js (16 tests)            # JWT tokens, password reset, RBAC

 Test Files  9 passed (9)
      Tests  98 passed (98)
   Duration  2.88s
```

### Frontend Code Quality & Bundle Compilation
```powershell
cd frontend
npm run lint    # oxlint: 0 errors
npm run build   # Vite: Clean production build in ~500ms
```

---

## 🔑 Pre-Seeded Test Accounts

All pre-seeded accounts share the password: **`Password123!`**

| Role | Account Email | Password | Primary Platform Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@codecrafthub.dev` | `Password123!` | System telemetry, user governance, course publishing approval, full platform control. |
| **Instructor** | `sarah.dr@codecrafthub.dev` | `Password123!` | Instructor Studio, course authoring, curriculum builder, student enrollment stats. |
| **Instructor** | `alex.chen@codecrafthub.dev` | `Password123!` | Course management, syllabus builder, reviews analytics. |
| **Student** | `marcus.vance@gmail.com` | `Password123!` | Course catalog, interactive workspace, progress telemetry, certificates, AI recommendations. |
| **Student** | `elena.rostova@gmail.com` | `Password123!` | Course catalog, learning workspace, skill gap analysis. |

---

## ⚡ Quick Start & Local Execution

### Prerequisites
- **Node.js:** v20.x, v22.x, or v24.x LTS
- **PostgreSQL:** v16+ (PostgreSQL 18 recommended) on `localhost:5432`
- **Git**

### 1. Backend Setup
```powershell
cd backend
cp .env.example .env
npm install
npm run db:setup     # Initializes database, runs migrations, and injects seeds
npm run verify:env   # Verifies DB connectivity and configuration
npm test             # Executes all 98 automated tests
npm run dev          # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```powershell
cd frontend
cp .env.example .env
npm install
npm run dev          # Starts Vite dev server on http://localhost:5173
```

---

## 🚀 Production Deployment & Containerization

### Option A: One-Click Docker Compose
```bash
cp .env.production.example .env
docker compose up -d --build
docker compose ps
```
Services exposed:
- **Frontend (Nginx SPA):** `http://localhost`
- **Backend (Node.js API):** `http://localhost:5000/api/v1`
- **PostgreSQL Database:** `localhost:5432`

### Option B: Linux VPS with PM2 & Nginx
1. **PM2 Cluster:** `cd backend && pm2 start ecosystem.config.cjs --env production`
2. **Build Frontend:** `cd frontend && npm ci && npm run build`
3. **Nginx Reverse Proxy:** Follow complete template in [**`docs/DEPLOYMENT_GUIDE.md`**](file:///F:/CodeCraftHub/docs/DEPLOYMENT_GUIDE.md).
4. **SSL Certificates:** `certbot --nginx -d codecrafthub.dev`

---

## 🌿 Git Workflow & Remote Repository Push

### Git Commit Milestones
```
adaa02f docs(deployment): complete Phase 13 Documentation, Docker configurations, and Production Deployment Preparation
ab8a91d test(security-e2e): complete Phase 12 End-to-End Integration, Security Audit, and Automated Testing
8f23ce6 feat(admin-instructor): complete Phase 11 Instructor Studio, Curriculum Builder, and Admin Governance Portal
6928cb9 feat(ai): complete Phase 10 AI-Powered Recommendations & Skill Gap Engine
c6a7a0b feat(workspace): complete Phase 9 Learning Workspace and Progress Analytics
98de7e5 feat(student-dashboard): complete Phase 8 Student Dashboard and Course Discovery
d727b3b feat(frontend-ui): complete Phase 7 React Frontend Setup and Reusable UI Components
3465342 feat(enrollment): complete Phase 6 Enrollment and Learning Progress APIs
4c0b4cb feat(course): complete Phase 5 Course and Lesson Management APIs
6cb7d31 feat(auth): complete Phase 4 Authentication & Role-Based Authorization
2ec32c0 feat(server): complete Phase 3 Express Server Architecture & Middleware
1b63dd1 feat(database): complete Phase 2 PostgreSQL Database Architecture & Migrations
688a4e3 feat(setup): complete Phase 1 Project Setup and Environment Verification
```

### How to Push to Your Remote Git Repository
If you have created a repository on GitHub, GitLab, or Bitbucket, link and push using the following commands:

```bash
# 1. Add your remote repository origin
git remote add origin https://github.com/<your-username>/CodeCraftHub.git

# 2. Ensure current branch is named master (or main)
git branch -M master

# 3. Push all commits, branches, and tags to remote
git push -u origin master
```

---

## 📚 Platform Documentation Index

- 📐 [**System Architecture Specification**](file:///F:/CodeCraftHub/docs/ARCHITECTURE.md): System topology, JWT lifecycle, data flow diagrams, and security architecture.
- 🗄️ [**Database Schema & ERD**](file:///F:/CodeCraftHub/docs/DATABASE_SCHEMA.md): Complete 18-table relational schema, constraints, cascade rules, and trigger definitions.
- 🔌 [**REST API Documentation**](file:///F:/CodeCraftHub/docs/API_DOCUMENTATION.md): Complete 32-endpoint catalog with request/response payloads, query parameters, status codes, and error codes.
- 🚀 [**Production Deployment Guide**](file:///F:/CodeCraftHub/docs/DEPLOYMENT_GUIDE.md): PM2 cluster scaling, Nginx reverse proxy configuration, SSL certificates, automated backups, and incident runbooks.

---

## 📄 License & Attribution

This project is licensed under the **MIT License**.  
Developed with precision by the CodeCraftHub Engineering Team.
