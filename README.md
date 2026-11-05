# CodeCraftHub – Personalized Developer Learning Platform

> **Tagline:** Learn Smarter. Build Better. Grow Faster.  
> **Visual Identity:** Premium Dark SaaS / Developer Education Platform (Dark Navy `#0B1020` & Electric Purple `#7C5CFC`)

---

## Architecture Overview

CodeCraftHub is a production-grade personalized learning management platform (LMS) designed for software developers and engineering students. It combines structured technical curriculum, real-time learning telemetry, and an AI recommendation engine to identify skill gaps and generate personalized learning paths.

```
CodeCraftHub/
├── backend/                  # Node.js + Express + PostgreSQL REST API
│   ├── database/             # Migrations & realistic seed data
│   ├── scripts/              # Verification & maintenance utilities
│   ├── src/                  # Controllers, models, services, routes, middleware
│   └── tests/                # Automated API & unit tests
├── frontend/                 # React 19 + Vite + Tailwind CSS v4 SPA
│   ├── public/               # Static assets & favicon
│   └── src/                  # Components, layouts, pages, hooks, contexts
├── docs/                     # Architectural specs, database schema, API guides
├── .gitignore                # Production git ignore specification
└── README.md                 # Project root documentation
```

---

## Roles & Access Control

1. **Student:** Course discovery, interactive lesson workspace, progress analytics, AI learning path recommendations, certificates.
2. **Instructor:** Curriculum builder, lesson & resource manager, student progress tracker, course review feedback.
3. **Administrator:** System analytics, user & role management, course publishing approval, category management, AI recommendation audit.

---

## 13-Phase Engineering Roadmap

- [x] **Phase 1:** Project Setup & Environment Verification
- [ ] **Phase 2:** PostgreSQL Database Architecture & Migrations
- [ ] **Phase 3:** Express Server Architecture & Middleware
- [ ] **Phase 4:** Authentication & Role-Based Authorization
- [ ] **Phase 5:** Course & Lesson Management APIs
- [ ] **Phase 6:** Enrollment & Learning Progress APIs
- [ ] **Phase 7:** React Frontend Setup & Reusable UI Components
- [ ] **Phase 8:** Student Dashboard & Course Discovery
- [ ] **Phase 9:** Learning Workspace & Progress Analytics
- [ ] **Phase 10:** AI Recommendations & Personalized Learning
- [ ] **Phase 11:** Instructor & Administrator Dashboards
- [ ] **Phase 12:** Testing, Security Review & Bug Fixing
- [ ] **Phase 13:** Documentation & Production Deployment Guide

---

## Quick Start (Phase 1)

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL 18
- Git

### 1. Backend Setup
```powershell
cd backend
npm install
npm run verify:env
npm test
npm run dev
```

### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to see the CodeCraftHub interface.

