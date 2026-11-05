# CodeCraftHub – System Architecture Documentation

## 1. System High-Level Design

CodeCraftHub is structured as a decoupled full-stack application following layered architectural principles:

```
[Client Browser]
       │
       ▼
[React 19 + Vite SPA] (Tailwind CSS v4, Inter & JetBrains Mono)
       │
   REST (JSON /api/v1)
       ▼
[Express.js Application]
  ├─ Helmet (Security headers)
  ├─ CORS (Configured origin allowlist)
  ├─ Morgan (Dev HTTP request logger)
  ├─ Rate Limiting (Brute-force protection)
  ├─ JWT & RBAC Middleware
  ├─ Zod / Express-Validator
  └─ Route Controllers
       │
       ▼
[Business Service Layer]
  ├─ AuthService (Bcrypt, JWT issuing)
  ├─ CourseService (Curriculum & lessons)
  ├─ ProgressService (Normalized tracking, streak calculation)
  └─ AIService (OpenAI provider + rule-based heuristic fallback)
       │
       ▼
[Database Access Layer (pg.Pool)]
       │
       ▼
[PostgreSQL 18 Database: codecrafthub_db]
```

## 2. Design System Tokens

| Token | Hex Code | Purpose |
|---|---|---|
| Primary Background | `#0B1020` | Canvas base for immersive dark workspace |
| Surface | `#151C31` | Cards, panels, navigation containers |
| Input Background | `#10182B` | Form inputs, search fields, code blocks |
| Primary Purple | `#7C5CFC` | Primary CTA buttons, active accents, key metrics |
| Secondary Purple | `#A78BFA` | Sub-headings, active indicators, badges |
| Primary Text | `#F8FAFC` | Primary headlines and high-emphasis copy |
| Secondary Text | `#CBD5E1` | Body copy, descriptions, secondary values |
| Muted Text | `#94A3B8` | Captions, timestamps, disabled states |
| Border | `#27324A` | Subtle dividers, card borders, separators |
| Success | `#22C55E` | Completion badges, healthy indicators |
| Warning | `#F59E0B` | In-progress statuses, alerts |
| Error | `#EF4444` | Validation errors, failure messages |

## 3. Database Schema Blueprint (18 Normalized Tables)

1. `users` (UUID, email, password_hash, role_id, is_active, created_at, updated_at)
2. `user_profiles` (user_id FK, first_name, last_name, bio, avatar_url, github_url, linkedin_url, learning_goals)
3. `roles` (id, name: 'student', 'instructor', 'admin', description)
4. `courses` (UUID, title, slug, description, instructor_id FK, thumbnail_url, difficulty_level, estimated_hours, is_published)
5. `categories` (UUID, name, slug, icon, description)
6. `course_categories` (course_id FK, category_id FK)
7. `lessons` (UUID, course_id FK, title, description, video_url, content_markdown, order_index, duration_minutes, is_free_preview)
8. `enrollments` (UUID, user_id FK, course_id FK, enrolled_at, completed_at, progress_percentage, status)
9. `lesson_progress` (UUID, enrollment_id FK, lesson_id FK, completed, completed_at, last_accessed_at)
10. `learning_paths` (UUID, title, description, target_role, difficulty_level, estimated_weeks)
11. `learning_path_courses` (learning_path_id FK, course_id FK, sequence_order)
12. `skills` (UUID, name, slug, category)
13. `user_skills` (user_id FK, skill_id FK, proficiency_level, verified_at)
14. `course_skills` (course_id FK, skill_id FK, skill_level_gained)
15. `ai_recommendations` (UUID, user_id FK, recommendation_type, recommended_entity_id, reason, confidence_score, metadata_json)
16. `reviews` (UUID, user_id FK, course_id FK, rating 1-5, review_text, created_at)
17. `certificates` (UUID, user_id FK, course_id FK, certificate_code, issued_at, verification_url)
18. `notifications` (UUID, user_id FK, title, message, type, is_read, created_at)

## 4. API Endpoints Map (/api/v1)

### Public / Utility
- `GET /` - Root platform welcome
- `GET /api/v1/info` - Metadata & capability summary
- `GET /api/v1/health` - Server and PostgreSQL pool diagnostic telemetry

### Forthcoming Phase Modules
- Auth: `/api/v1/auth/*`
- Users: `/api/v1/users/*`
- Courses: `/api/v1/courses/*`
- Lessons: `/api/v1/lessons/*`
- Enrollments: `/api/v1/enrollments/*`
- Progress: `/api/v1/progress/*`
- AI: `/api/v1/ai/*`
- Admin: `/api/v1/admin/*`

