# CodeCraftHub - Frontend Application

Personalized Developer Learning Platform (LMS) - Modern Dark SaaS Dashboard UI.

## Visual Design Tokens (Figma Master Spec)
- **Primary Background:** `#0B1020`
- **Surface:** `#151C31`
- **Input Background:** `#10182B`
- **Primary Purple:** `#7C5CFC`
- **Secondary Purple:** `#A78BFA`
- **Primary Text:** `#F8FAFC`
- **Secondary Text:** `#CBD5E1`
- **Muted Text:** `#94A3B8`
- **Border:** `#27324A`
- **Success:** `#22C55E`
- **Warning:** `#F59E0B`
- **Error:** `#EF4444`
- **Typography:** Inter (body/headings) & JetBrains Mono (code)

## Technology Stack
- **Framework:** React 19
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Charts:** Recharts
- **Routing:** React Router DOM
- **HTTP Client:** Axios

## Directory Structure
```
frontend/
├── src/
│   ├── assets/       # Static assets, logos, and images
│   ├── components/   # Reusable UI components (buttons, cards, badges)
│   ├── layouts/      # Dashboard, auth, and public layouts
│   ├── pages/        # Application screens
│   ├── hooks/        # Custom React hooks
│   ├── contexts/     # Auth and state providers
│   ├── services/     # Axios API services
│   ├── routes/       # Protected and role-based routes
│   ├── utils/        # Formatting and utility functions
│   ├── App.jsx       # Root application component
│   ├── main.jsx      # Vite entry point
│   └── index.css     # Tailwind CSS base and theme rules
├── public/           # Static public assets
├── .env.example      # Frontend environment variables template
└── package.json
```

## Setup & Execution

### 1. Configure Environment
Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Build & Preview
```powershell
npm run build
npm run preview
```

### 4. Run Development Server
```powershell
npm run dev
```
Client will run on `http://localhost:5173`.
