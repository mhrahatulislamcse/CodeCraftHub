# CodeCraftHub - Backend API

Personalized Developer Learning Platform (LMS) - Backend Service.

## Technology Stack
- **Runtime:** Node.js (v24+) ES6+ Modules
- **Framework:** Express.js
- **Database:** PostgreSQL 18 with `pg` (node-postgres)
- **Security:** Helmet, CORS, JWT (`jsonwebtoken`), bcrypt password hashing (`bcryptjs`)
- **Validation:** Express Validator
- **Testing:** Vitest & Supertest

## Directory Structure
```
backend/
├── src/
│   ├── config/       # Environment & Database pool configuration
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Auth, error handling, rate limiting
│   ├── models/       # Data access and database queries
│   ├── routes/       # API route definitions (/api/v1)
│   ├── services/     # Business logic & AI orchestration
│   ├── validators/   # Request input validation schemas
│   ├── utils/        # Helper functions
│   ├── app.js        # Express application configuration
│   └── server.js     # Server entry point & graceful shutdown
├── database/
│   ├── migrations/   # SQL schema migrations
│   └── seeds/        # Realistic development seed data
├── scripts/
│   └── verify-env.js # Environment verification script
├── tests/            # Vitest unit & integration tests
├── .env.example      # Environment variables template
└── package.json
```

## Setup & Execution

### 1. Configure Environment
Copy `.env.example` to `.env` and set your PostgreSQL password:
```powershell
cp .env.example .env
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Verify Environment
```powershell
npm run verify:env
```

### 4. Run Tests
```powershell
npm test
```

### 5. Start Development Server
```powershell
npm run dev
```
API will run at `http://localhost:5000` with health check at `http://localhost:5000/api/v1/health`.
