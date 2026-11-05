-- ============================================================================
-- CodeCraftHub PostgreSQL Database Seed: 001_initial_seeds.sql
-- Description: Realistic initial seed data for development and testing
-- All passwords are: Password123!
-- Bcrypt Hash: $2a$10$FMncnQ/YNtlrIlP/XZ5k0.tfwfQh7/A.vIzip2GPwPtZoX0q5Lovu
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED ROLES
-- ----------------------------------------------------------------------------
INSERT INTO roles (id, name, description) VALUES
(1, 'student', 'Developer or learner exploring courses and earning skills'),
(2, 'instructor', 'Educator creating courses, lessons, and managing curriculum'),
(3, 'admin', 'System administrator managing platform, users, and compliance')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Reset sequence to avoid collision
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));

-- ----------------------------------------------------------------------------
-- 2. SEED USERS (Deterministic UUIDs)
-- ----------------------------------------------------------------------------
-- Admin: a0000000-0000-0000-0000-000000000001
-- Instructor 1: i0000000-0000-0000-0000-000000000001 (Sarah Drasner)
-- Instructor 2: i0000000-0000-0000-0000-000000000002 (Alex Chen)
-- Student 1: s0000000-0000-0000-0000-000000000001 (Marcus Vance)
-- Student 2: s0000000-0000-0000-0000-000000000002 (Elena Rostova)

INSERT INTO users (id, email, password_hash, role_id, is_active, email_verified) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@codecrafthub.dev', '$2a$10$FMncnQ/YNtlrIlP/XZ5k0.tfwfQh7/A.vIzip2GPwPtZoX0q5Lovu', 3, true, true),
('i0000000-0000-0000-0000-000000000001', 'sarah.dr@codecrafthub.dev', '$2a$10$FMncnQ/YNtlrIlP/XZ5k0.tfwfQh7/A.vIzip2GPwPtZoX0q5Lovu', 2, true, true),
('i0000000-0000-0000-0000-000000000002', 'alex.chen@codecrafthub.dev', '$2a$10$FMncnQ/YNtlrIlP/XZ5k0.tfwfQh7/A.vIzip2GPwPtZoX0q5Lovu', 2, true, true),
('s0000000-0000-0000-0000-000000000001', 'marcus.vance@gmail.com', '$2a$10$FMncnQ/YNtlrIlP/XZ5k0.tfwfQh7/A.vIzip2GPwPtZoX0q5Lovu', 1, true, true),
('s0000000-0000-0000-0000-000000000002', 'elena.rostova@gmail.com', '$2a$10$FMncnQ/YNtlrIlP/XZ5k0.tfwfQh7/A.vIzip2GPwPtZoX0q5Lovu', 1, true, true)
ON CONFLICT (email) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. SEED USER PROFILES
-- ----------------------------------------------------------------------------
INSERT INTO user_profiles (user_id, first_name, last_name, headline, bio, avatar_url, github_url, linkedin_url, learning_goals, preferred_difficulty) VALUES
('a0000000-0000-0000-0000-000000000001', 'Devon', 'Archer', 'Platform Lead & Systems Architect', 'Oversees CodeCraftHub core infrastructure and curriculum quality.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', 'https://github.com/codecrafthub', 'https://linkedin.com', '{"Maintain platform stability", "Monitor AI metrics"}', 'All Levels'),

('i0000000-0000-0000-0000-000000000001', 'Sarah', 'Drasner', 'Senior Full-Stack Architect & Author', 'Former VP at Netlify, author, and distributed frontend systems expert.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', 'https://github.com/sdras', 'https://linkedin.com', '{"Build deep modern web courses", "Mentor rising engineers"}', 'All Levels'),

('i0000000-0000-0000-0000-000000000002', 'Alex', 'Chen', 'Principal Cloud & Database Engineer', 'Specialized in PostgreSQL performance tuning, Kubernetes, and high-throughput microservices.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', 'https://github.com/alexchen-dev', 'https://linkedin.com', '{"Demystify distributed systems", "Teach production PostgreSQL"}', 'All Levels'),

('s0000000-0000-0000-0000-000000000001', 'Marcus', 'Vance', 'Frontend Developer seeking Full-Stack Mastery', 'Self-taught engineer with solid React and JavaScript skills, leveling up in Node.js, Express, and PostgreSQL.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', 'https://github.com/marcusvance', 'https://linkedin.com', '{"Become a confident Full-Stack Engineer", "Master PostgreSQL transactions", "Deploy Docker apps"}', 'Intermediate'),

('s0000000-0000-0000-0000-000000000002', 'Elena', 'Rostova', 'Computer Science Graduate & Backend Enthusiast', 'Focused on relational databases, database query optimization, and clean API design.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', 'https://github.com/elenarostova', 'https://linkedin.com', '{"Pass technical backend interviews", "Architect resilient REST APIs"}', 'Beginner')
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio;

-- ----------------------------------------------------------------------------
-- 4. SEED CATEGORIES
-- ----------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Full-Stack Development', 'full-stack-development', 'Layers', 'Modern end-to-end web application development with React, Node.js, and databases.', 1),
('c0000000-0000-0000-0000-000000000002', 'Database Engineering', 'database-engineering', 'Database', 'Relational database schema modeling, indexing, SQL optimization, and transactional safety.', 2),
('c0000000-0000-0000-0000-000000000003', 'DevOps & Cloud', 'devops-cloud', 'Cloud', 'Containerization with Docker, Kubernetes, CI/CD pipelines, and cloud native architectures.', 3),
('c0000000-0000-0000-0000-000000000004', 'Software Architecture & Design', 'software-architecture', 'Cpu', 'Design patterns, clean code principles, refactoring techniques, and scalability.', 4),
('c0000000-0000-0000-0000-000000000005', 'Frontend Mastery', 'frontend-mastery', 'Code', 'Deep dive into modern JavaScript, React state patterns, performance, and accessibility.', 5)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. SEED SKILLS
-- ----------------------------------------------------------------------------
INSERT INTO skills (id, name, slug, category, description) VALUES
('k0000000-0000-0000-0000-000000000001', 'JavaScript (ES6+)', 'javascript', 'Frontend', 'Modern ECMAScript specifications, async/await, closures, and prototypes.'),
('k0000000-0000-0000-0000-000000000002', 'React.js', 'react', 'Frontend', 'Component lifecycle, hooks, context API, and high-performance state management.'),
('k0000000-0000-0000-0000-000000000003', 'Node.js', 'nodejs', 'Backend', 'Event-driven asynchronous I/O, server architecture, and streams.'),
('k0000000-0000-0000-0000-000000000004', 'Express.js', 'express', 'Backend', 'RESTful API routing, middleware chaining, and security practices.'),
('k0000000-0000-0000-0000-000000000005', 'PostgreSQL', 'postgresql', 'Database', 'Relational modeling, complex queries, indexing, CTEs, and ACID transactions.'),
('k0000000-0000-0000-0000-000000000006', 'Docker', 'docker', 'DevOps', 'Multi-stage Dockerfiles, compose stacks, container isolation, and networks.'),
('k0000000-0000-0000-0000-000000000007', 'REST API Design', 'rest-api', 'Backend', 'Idempotent endpoints, HTTP status standards, error schemas, and versioning.'),
('k0000000-0000-0000-0000-000000000008', 'Git & GitHub', 'git', 'DevOps', 'Version control branching models, rebasing, merge conflicts, and PR reviews.')
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. SEED COURSES
-- ----------------------------------------------------------------------------
INSERT INTO courses (id, title, slug, description, instructor_id, thumbnail_url, difficulty_level, estimated_hours, is_published, published_at, rating_average, rating_count, enrollment_count, learning_objectives, prerequisites) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'Production Full-Stack React & Node Architecture',
  'production-fullstack-react-node',
  'Master the complete architecture required to build, secure, and deploy high-performance full-stack web applications using React, Express, and PostgreSQL.',
  'i0000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
  'Intermediate',
  18.5,
  true,
  CURRENT_TIMESTAMP - INTERVAL '30 days',
  4.92,
  48,
  124,
  '{"Build a complete SaaS platform from scratch", "Implement JWT auth with refresh tokens", "Design normalized PostgreSQL schemas with node-postgres", "Structure clean frontend state with Tailwind CSS"}',
  '{"Basic JavaScript knowledge (variables, functions, promises)", "Familiarity with HTML and CSS"}'
),
(
  'b0000000-0000-0000-0000-000000000002',
  'PostgreSQL Mastery: High-Performance Schema & Queries',
  'postgresql-mastery-schema-queries',
  'Deep dive into PostgreSQL internals, index strategies, transaction isolation levels, query execution planning, and schema migrations without downtime.',
  'i0000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop',
  'Advanced',
  14.0,
  true,
  CURRENT_TIMESTAMP - INTERVAL '20 days',
  4.88,
  35,
  98,
  '{"Diagnose query bottlenecks using EXPLAIN ANALYZE", "Implement B-Tree, GIN, and BRIN indexes effectively", "Prevent deadlocks with proper lock order", "Automate zero-downtime database migrations"}',
  '{"Basic SQL syntax (SELECT, INSERT, JOIN)", "Working knowledge of a relational database"}'
),
(
  'b0000000-0000-0000-0000-000000000003',
  'Docker & Microservices for Developers',
  'docker-microservices-developers',
  'Containerize backend services, manage local multi-container development environments with Docker Compose, and configure reproducible production builds.',
  'i0000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&h=450&fit=crop',
  'Intermediate',
  12.0,
  true,
  CURRENT_TIMESTAMP - INTERVAL '15 days',
  4.75,
  29,
  76,
  '{"Create minimal, secure multi-stage Docker images", "Orchestrate app + db + redis with Docker Compose", "Manage persistent volumes and internal network bridges", "Implement healthchecks and graceful shutdowns"}',
  '{"Command line familiarity", "Basic understanding of client-server networking"}'
),
(
  'b0000000-0000-0000-0000-000000000004',
  'Modern JavaScript: From ES6+ to Architecture',
  'modern-javascript-architecture',
  'Master modern JavaScript fundamentals, async execution loop, closures, modular design, functional patterns, and clean code principles.',
  'i0000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=450&fit=crop',
  'Beginner',
  10.0,
  true,
  CURRENT_TIMESTAMP - INTERVAL '45 days',
  4.95,
  62,
  180,
  '{"Understand event loop and microtask queuing", "Master ES6+ syntax: destructuring, modules, optional chaining", "Write functional and immutable JavaScript code", "Structure maintainable frontend codebases"}',
  '{"No prior programming experience required"}'
)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. SEED COURSE CATEGORIES
-- ----------------------------------------------------------------------------
INSERT INTO course_categories (course_id, category_id) VALUES
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'), -- Course 1 -> Full-Stack
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005'), -- Course 1 -> Frontend
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002'), -- Course 2 -> Database
('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003'), -- Course 3 -> DevOps
('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005')  -- Course 4 -> Frontend
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 8. SEED COURSE SKILLS
-- ----------------------------------------------------------------------------
INSERT INTO course_skills (course_id, skill_id, skill_level_gained) VALUES
('b0000000-0000-0000-0000-000000000001', 'k0000000-0000-0000-0000-000000000002', 'Advanced'),     -- React
('b0000000-0000-0000-0000-000000000001', 'k0000000-0000-0000-0000-000000000003', 'Intermediate'), -- Node.js
('b0000000-0000-0000-0000-000000000001', 'k0000000-0000-0000-0000-000000000004', 'Advanced'),     -- Express
('b0000000-0000-0000-0000-000000000001', 'k0000000-0000-0000-0000-000000000005', 'Intermediate'), -- PostgreSQL
('b0000000-0000-0000-0000-000000000002', 'k0000000-0000-0000-0000-000000000005', 'Expert'),       -- PostgreSQL
('b0000000-0000-0000-0000-000000000003', 'k0000000-0000-0000-0000-000000000006', 'Advanced'),     -- Docker
('b0000000-0000-0000-0000-000000000004', 'k0000000-0000-0000-0000-000000000001', 'Intermediate')  -- JavaScript
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 9. SEED LESSONS (Course 1: Full-Stack React & Node)
-- ----------------------------------------------------------------------------
INSERT INTO lessons (id, course_id, title, slug, description, video_url, content_markdown, order_index, duration_minutes, is_free_preview) VALUES
(
  'l0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Architectural Overview & Decoupled Design Patterns',
  'architectural-overview-decoupled-design',
  'Understand clean client-server separation, REST standards, and security boundaries.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Full-Stack Architecture Principles
A modern developer LMS requires clean separation of concerns:
- **Client Tier**: React Single Page Application with optimized bundle splitting.
- **API Gateway Tier**: Express.js with rate limiting, Helmet, CORS, and JWT authentication.
- **Data Tier**: PostgreSQL with parameterized queries and transactional atomicity.

```javascript
// Clean Controller-Service-Data pattern example:
export const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.findById(req.params.id);
    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};
```',
  1,
  18,
  true
),
(
  'l0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'Configuring Express, Security Headers & PostgreSQL Pool',
  'configuring-express-security-postgresql-pool',
  'Setting up connection pooling with pg.Pool, environment variables, and error middlewares.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Database Pooling Best Practices
Never open individual client connections for each request. Instead, use a shared connection pool:

```javascript
import pg from ''pg'';
const { Pool } = pg;

export const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```',
  2,
  24,
  false
),
(
  'l0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000001',
  'JWT Authentication, Refresh Tokens & Role-Based Access Control',
  'jwt-auth-refresh-tokens-rbac',
  'Implement stateless JWT authentication, password hashing with bcrypt, and role guards.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Role-Based Access Middleware
Protect routes based on user role:

```javascript
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: ''Forbidden: Insufficient permissions'' });
  }
  next();
};
```',
  3,
  32,
  false
),
(
  'l0000000-0000-0000-0000-000000000004',
  'b0000000-0000-0000-0000-000000000001',
  'Interactive Learning Workspace & Live Video Player Integration',
  'interactive-learning-workspace-video-player',
  'Build the student curriculum sidebar, video interface, and progress toggles in React.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Building the Learning Workspace UI
The learning workspace incorporates:
1. Video embed player
2. Markdown lesson description
3. Curriculum lesson switcher
4. "Mark as Complete" synchronous status tracker',
  4,
  28,
  false
)
ON CONFLICT (course_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 10. SEED LESSONS (Course 2: PostgreSQL Mastery)
-- ----------------------------------------------------------------------------
INSERT INTO lessons (id, course_id, title, slug, description, video_url, content_markdown, order_index, duration_minutes, is_free_preview) VALUES
(
  'l0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000002',
  'Relational Schema Normalization & Constraint Design',
  'relational-schema-normalization-constraints',
  'Design 3NF schemas, foreign keys, cascade rules, and check constraints.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Database Normalization
Ensure every non-key attribute is dependent on the key, the whole key, and nothing but the key.',
  1,
  22,
  true
),
(
  'l0000000-0000-0000-0000-000000000006',
  'b0000000-0000-0000-0000-000000000002',
  'Mastering Indexes: B-Tree, GIN, Partial & Covering Indexes',
  'mastering-indexes-btree-gin-partial',
  'Deep dive into PostgreSQL index types and their performance trade-offs.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Index Optimization
Covering index example:
```sql
CREATE INDEX idx_user_active_email ON users(email) WHERE is_active = true;
```',
  2,
  35,
  false
)
ON CONFLICT (course_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 11. SEED LEARNING PATHS
-- ----------------------------------------------------------------------------
INSERT INTO learning_paths (id, title, slug, description, target_role, difficulty_level, estimated_weeks, thumbnail_url, is_published) VALUES
(
  'p0000000-0000-0000-0000-000000000001',
  'Full-Stack JavaScript & React Engineer Path',
  'fullstack-javascript-react-engineer',
  'Comprehensive curriculum designed to transform aspiring engineers into high-performing Full-Stack JavaScript and React developers.',
  'Full-Stack Developer',
  'Intermediate',
  10,
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
  true
),
(
  'p0000000-0000-0000-0000-000000000002',
  'Backend & Cloud Database Architect Path',
  'backend-cloud-database-architect',
  'Master PostgreSQL internals, containerized microservices, and resilient API architecture.',
  'Backend Engineer',
  'Advanced',
  12,
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Map courses to paths
INSERT INTO learning_path_courses (learning_path_id, course_id, sequence_order) VALUES
('p0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 1), -- Modern JS first
('p0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 2), -- Full-Stack second
('p0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 1), -- PostgreSQL Mastery
('p0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 2)  -- Docker Microservices
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 12. SEED USER SKILLS (Marcus Vance)
-- ----------------------------------------------------------------------------
INSERT INTO user_skills (user_id, skill_id, proficiency_level, verified_at) VALUES
('s0000000-0000-0000-0000-000000000001', 'k0000000-0000-0000-0000-000000000001', 'Intermediate', CURRENT_TIMESTAMP),
('s0000000-0000-0000-0000-000000000001', 'k0000000-0000-0000-0000-000000000002', 'Beginner', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 13. SEED ENROLLMENTS (Marcus Vance & Elena Rostova)
-- ----------------------------------------------------------------------------
INSERT INTO enrollments (id, user_id, course_id, enrolled_at, progress_percentage, status) VALUES
('e0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP - INTERVAL '5 days', 0.00, 'active'),
('e0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP - INTERVAL '2 days', 0.00, 'active')
ON CONFLICT (user_id, course_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 14. SEED LESSON PROGRESS
-- Marking lessons 1 and 2 as completed for Marcus Vance
-- The database trigger trg_sync_enrollment_progress will automatically update enrollments.progress_percentage to 50.00%!
-- ----------------------------------------------------------------------------
INSERT INTO lesson_progress (enrollment_id, lesson_id, completed, completed_at) VALUES
('e0000000-0000-0000-0000-000000000001', 'l0000000-0000-0000-0000-000000000001', true, CURRENT_TIMESTAMP - INTERVAL '4 days'),
('e0000000-0000-0000-0000-000000000001', 'l0000000-0000-0000-0000-000000000002', true, CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT (enrollment_id, lesson_id) DO UPDATE SET completed = EXCLUDED.completed;

-- ----------------------------------------------------------------------------
-- 15. SEED AI RECOMMENDATIONS
-- ----------------------------------------------------------------------------
INSERT INTO ai_recommendations (user_id, recommendation_type, recommended_entity_id, reason, confidence_score, metadata_json) VALUES
(
  's0000000-0000-0000-0000-000000000001',
  'next_lesson',
  'l0000000-0000-0000-0000-000000000003',
  'You have completed Lesson 1 and Lesson 2 of Full-Stack React & Node. Continue directly to JWT Authentication to secure your APIs.',
  0.940,
  '{"course_id": "b0000000-0000-0000-0000-000000000001", "lesson_title": "JWT Authentication, Refresh Tokens & Role-Based Access Control"}'
),
(
  's0000000-0000-0000-0000-000000000001',
  'skill_gap',
  'k0000000-0000-0000-0000-000000000006',
  'Skill gap detected: Your goal is "Deploy Docker apps", but you have not yet started the Docker & Microservices curriculum.',
  0.890,
  '{"missing_skill": "Docker", "recommended_course_id": "b0000000-0000-0000-0000-000000000003"}'
);

-- ----------------------------------------------------------------------------
-- 16. SEED REVIEWS
-- ----------------------------------------------------------------------------
INSERT INTO reviews (user_id, course_id, rating, review_text) VALUES
('s0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 5, 'Exceptional walkthrough of decoupled architecture! The clean separation of controllers and services is already transforming how I write code.'),
('s0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 5, 'The best PostgreSQL index optimization explanation I have encountered. Practical, deep, and directly applicable to production workloads.')
ON CONFLICT (user_id, course_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 17. SEED NOTIFICATIONS
-- ----------------------------------------------------------------------------
INSERT INTO notifications (user_id, title, message, type, action_url) VALUES
('s0000000-0000-0000-0000-000000000001', 'Welcome to CodeCraftHub!', 'Explore courses and customize your developer learning goals in your profile.', 'info', '/profile'),
('s0000000-0000-0000-0000-000000000001', '50% Milestone Reached', 'You are halfway through Production Full-Stack React & Node Architecture!', 'achievement', '/learn/b0000000-0000-0000-0000-000000000001'),
('s0000000-0000-0000-0000-000000000001', 'AI Recommendation Generated', 'New personalized learning recommendation based on your technical progress.', 'recommendation', '/recommendations');
