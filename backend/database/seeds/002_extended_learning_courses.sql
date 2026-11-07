-- ============================================================================
-- CodeCraftHub Database Seed: 002_extended_learning_courses.sql
-- Description: Comprehensive curriculum expansion with 5 new enterprise courses
-- and full syllabi (lessons, code snippets, categories, skills, and reviews).
-- ============================================================================

-- Clean up any residual automated test courses
DELETE FROM courses WHERE slug LIKE 'high-concurrency-redis-caching-architecture%';

-- ----------------------------------------------------------------------------
-- 1. EXTENDED SKILLS
-- ----------------------------------------------------------------------------
INSERT INTO skills (id, name, slug, category, description) VALUES
('fa000000-0000-0000-0000-000000000009', 'TypeScript', 'typescript', 'Frontend', 'Static typing, advanced generics, conditional types, and compiler configuration.'),
('fa000000-0000-0000-0000-000000000010', 'Next.js', 'nextjs', 'Frontend', 'React 19 Server Components, App Router, Server Actions, and streaming SSR.'),
('fa000000-0000-0000-0000-000000000011', 'Kubernetes', 'kubernetes', 'DevOps', 'Container orchestration, Pods, Deployments, Services, Ingress, and Helm.'),
('fa000000-0000-0000-0000-000000000012', 'Redis', 'redis', 'Database', 'In-memory caching, distributed locks, pub/sub messaging, and Redis cluster.'),
('fa000000-0000-0000-0000-000000000013', 'System Design', 'system-design', 'Architecture', 'High-availability distributed architectures, CAP theorem, and event-driven patterns.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ----------------------------------------------------------------------------
-- 2. COMPLETE LESSONS FOR COURSE 3 (Docker & Microservices for Developers)
-- ----------------------------------------------------------------------------
INSERT INTO lessons (id, course_id, title, slug, description, video_url, content_markdown, order_index, duration_minutes, is_free_preview) VALUES
(
  'ea000000-0000-0000-0000-000000000007',
  'b0000000-0000-0000-0000-000000000003',
  'Container Fundamentals: Namespaces, Cgroups & Images',
  'container-fundamentals-namespaces-cgroups',
  'Understand Linux kernel namespaces, control groups (cgroups), and union file systems.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Containerization Under the Hood
Containers are not lightweight virtual machines. They are isolated host processes restricted by Linux kernel primitives:
- **Namespaces**: Process ID (PID), Network (NET), Mount (MNT), and IPC isolation.
- **Control Groups (cgroups)**: CPU and memory quota enforcement.
- **OverlayFS**: Layered, copy-on-write image filesystems.

```bash
# Inspect container namespaces:
lsns -p $(docker inspect --format ''{{.State.Pid}}'' <container_id>)
```',
  1,
  20,
  true
),
(
  'ea000000-0000-0000-0000-000000000008',
  'b0000000-0000-0000-0000-000000000003',
  'Multi-Stage Dockerfile Optimization & Minimal Base Images',
  'multistage-dockerfile-optimization',
  'Craft lean production images under 50MB using Node.js Alpine and multi-stage builds.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Multi-Stage Dockerfile Best Practice
Separate dependency compilation from production runtime:

```dockerfile
# Stage 1: Build & prune
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Lean runtime
FROM node:22-alpine AS runner
WORKDIR /app
USER node
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```',
  2,
  28,
  false
),
(
  'ea000000-0000-0000-0000-000000000009',
  'b0000000-0000-0000-0000-000000000003',
  'Multi-Container Orchestration with Docker Compose',
  'multicontainer-orchestration-docker-compose',
  'Coordinate Node.js, PostgreSQL, and Redis with healthchecks and isolated bridge networks.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Production-Ready Compose Services
Ensure dependent containers only launch after database healthchecks pass:

```yaml
services:
  backend:
    build: ./backend
    depends_on:
      postgres:
        condition: service_healthy
```',
  3,
  34,
  false
),
(
  'ea000000-0000-0000-0000-000000000010',
  'b0000000-0000-0000-0000-000000000003',
  'Production Healthchecks, Volume Persistence & Container Security',
  'production-healthchecks-volumes-security',
  'Configure Docker healthchecks, non-root users, read-only root filesystems, and named volumes.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Hardening Containers in Production
1. Never run containers as root (`USER node`).
2. Implement native healthchecks (`HEALTHCHECK --interval=30s`).
3. Store state exclusively in named volumes or external managed DBs.',
  4,
  25,
  false
)
ON CONFLICT (course_id, order_index) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown;

-- ----------------------------------------------------------------------------
-- 3. COMPLETE LESSONS FOR COURSE 4 (Modern JavaScript: From ES6+ to Architecture)
-- ----------------------------------------------------------------------------
INSERT INTO lessons (id, course_id, title, slug, description, video_url, content_markdown, order_index, duration_minutes, is_free_preview) VALUES
(
  'ea000000-0000-0000-0000-000000000011',
  'b0000000-0000-0000-0000-000000000004',
  'The Event Loop, Microtasks & Asynchronous Execution',
  'event-loop-microtasks-async-execution',
  'Demystify the call stack, macrotask queue, microtask queue, and render phases in V8.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### JavaScript Event Loop Mechanics
Microtasks (`Promise.then`, `queueMicrotask`) have strict execution priority over macrotasks (`setTimeout`, `setInterval`):

```javascript
console.log("1: Synchronous");
setTimeout(() => console.log("4: Macrotask"), 0);
Promise.resolve().then(() => console.log("2: Microtask 1"))
                 .then(() => console.log("3: Microtask 2"));
```',
  1,
  22,
  true
),
(
  'ea000000-0000-0000-0000-000000000012',
  'b0000000-0000-0000-0000-000000000004',
  'Closures, Lexical Scope & Functional Currying Patterns',
  'closures-lexical-scope-currying',
  'Harness closure preservation, function composition, memoization, and pure functions.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Practical Closure Memoization
```javascript
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```',
  2,
  26,
  false
),
(
  'ea000000-0000-0000-0000-000000000013',
  'b0000000-0000-0000-0000-000000000004',
  'Promises, Async/Await & AbortController in Practice',
  'promises-async-await-abortcontroller',
  'Master concurrent promise combinators (`Promise.allSettled`, `Promise.any`) and cancellation.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Graceful Request Cancellation with AbortController
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch("/api/v1/courses", { signal: controller.signal });
} finally {
  clearTimeout(timeoutId);
}
```',
  3,
  30,
  false
),
(
  'ea000000-0000-0000-0000-000000000014',
  'b0000000-0000-0000-0000-000000000004',
  'Memory Management, Garbage Collection & Avoiding Leaks',
  'memory-management-garbage-collection-leaks',
  'Detect detached DOM elements, uncleaned event listeners, and closure leaks using Chrome DevTools.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Common Memory Leak Vectors in JavaScript
1. Accidental global variables (`window.myData = ...`).
2. Forgotten timers and intervals (`setInterval`).
3. Out-of-DOM references and unremoved event listeners.',
  4,
  24,
  false
)
ON CONFLICT (course_id, order_index) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown;

-- ----------------------------------------------------------------------------
-- 4. NEW COURSES (5 Enterprise Courses)
-- ----------------------------------------------------------------------------
INSERT INTO courses (id, title, slug, description, instructor_id, thumbnail_url, difficulty_level, estimated_hours, is_published, published_at, rating_average, rating_count, enrollment_count, learning_objectives, prerequisites) VALUES
-- Course 5: Next.js 15 & React 19
(
  'b0000000-0000-0000-0000-000000000005',
  'Next.js 15 & React 19: Full-Stack Server Components & Actions',
  'nextjs-15-react-19-server-actions',
  'Architect cutting-edge web applications using Next.js 15 App Router, React 19 Server Components, Server Actions, streaming SSR, and edge middleware.',
  'ba000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
  'Intermediate',
  16.0,
  true,
  CURRENT_TIMESTAMP - INTERVAL '12 days',
  4.96,
  54,
  168,
  '{"Master the React 19 App Router & Server Components paradigm", "Eliminate traditional REST boilerplates using type-safe Server Actions", "Implement streaming SSR with Suspense and parallel routes", "Deploy optimized serverless builds with edge middleware"}',
  '{"Proficiency in React fundamentals", "Working knowledge of ES6+ JavaScript"}'
),

-- Course 6: Kubernetes & Cloud-Native DevOps Architecture
(
  'b0000000-0000-0000-0000-000000000006',
  'Kubernetes & Cloud-Native DevOps Architecture',
  'kubernetes-cloud-native-devops-architecture',
  'Master production container orchestration: build resilient Kubernetes clusters, automate rolling updates, manage ingress TLS, and deploy with Helm and GitOps.',
  'ba000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
  'Advanced',
  20.0,
  true,
  CURRENT_TIMESTAMP - INTERVAL '18 days',
  4.89,
  41,
  115,
  '{"Understand Kubernetes control plane and worker node architecture", "Design zero-downtime rolling updates with Deployments and Probes", "Configure Ingress Controllers with automatic Let''s Encrypt certificates", "Package complex multi-tier services using Helm charts"}',
  '{"Solid Docker containerization experience", "Linux command-line fluency"}'
),

-- Course 7: TypeScript Enterprise Architecture
(
  'b0000000-0000-0000-0000-000000000007',
  'TypeScript Enterprise Architecture: Generics & Design Patterns',
  'typescript-enterprise-architecture',
  'Level up from everyday TypeScript to advanced type-level metaprogramming: conditional types, mapped types, template literals, and design patterns for large-scale codebases.',
  'ba000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1516116211227-bbc03a277983?w=800&h=450&fit=crop',
  'Intermediate',
  14.5,
  true,
  CURRENT_TIMESTAMP - INTERVAL '25 days',
  4.93,
  39,
  140,
  '{"Master advanced generics, constraints, and the infer keyword", "Perform type-level transformations using mapped and conditional types", "Implement enterprise Gang-of-Four design patterns with type safety", "Achieve end-to-end type safety between client and API contracts using Zod"}',
  '{"Solid JavaScript experience", "Basic understanding of static types"}'
),

-- Course 8: Distributed Systems & Microservices Architecture
(
  'b0000000-0000-0000-0000-000000000008',
  'Distributed Systems & Microservices Architecture',
  'distributed-systems-microservices-architecture',
  'Learn how top tech companies architect fault-tolerant, high-scale distributed systems: event streaming with Kafka, saga transactions, circuit breakers, and observability.',
  'ba000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
  'Advanced',
  22.0,
  true,
  CURRENT_TIMESTAMP - INTERVAL '35 days',
  4.97,
  68,
  195,
  '{"Navigate trade-offs of the CAP theorem and PACELC theorem", "Build resilient asynchronous event-driven pipelines using Apache Kafka", "Guarantee data consistency across services with the Saga pattern", "Implement distributed tracing, OpenTelemetry, and circuit breaking"}',
  '{"Backend development experience with Node.js, Go, or Java", "Familiarity with relational databases"}'
),

-- Course 9: Redis Architecture: High-Concurrency Caching & Pub/Sub
(
  'b0000000-0000-0000-0000-000000000009',
  'Redis Architecture: High-Concurrency Caching & Pub/Sub',
  'redis-high-concurrency-caching-pubsub',
  'Supercharge web performance with Redis: in-memory data structures, cache eviction algorithms, distributed locks (Redlock), Pub/Sub messaging, and Redis cluster sharding.',
  'ba000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
  'Intermediate',
  11.5,
  true,
  CURRENT_TIMESTAMP - INTERVAL '8 days',
  4.86,
  27,
  88,
  '{"Master Redis memory layout, string, hash, set, and sorted-set operations", "Prevent cache stampede using probabilistic early expiration and distributed locks", "Implement real-time messaging using Redis Pub/Sub and Redis Streams", "Scale throughput with Redis Sentinel failover and Redis Cluster"}',
  '{"Familiarity with backend web services and SQL queries"}'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  difficulty_level = EXCLUDED.difficulty_level,
  learning_objectives = EXCLUDED.learning_objectives,
  prerequisites = EXCLUDED.prerequisites;

-- ----------------------------------------------------------------------------
-- 5. COURSE CATEGORIES ASSOCIATIONS
-- ----------------------------------------------------------------------------
INSERT INTO course_categories (course_id, category_id) VALUES
-- Course 5 -> Full-Stack & Frontend
('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005'),
-- Course 6 -> DevOps & Cloud
('b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000003'),
-- Course 7 -> Frontend & Software Architecture
('b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005'),
('b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000004'),
-- Course 8 -> Software Architecture
('b0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000004'),
-- Course 9 -> Database Engineering
('b0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. COURSE SKILLS ASSOCIATIONS
-- ----------------------------------------------------------------------------
INSERT INTO course_skills (course_id, skill_id, skill_level_gained) VALUES
-- Course 5 (Next.js 15) -> Next.js, React.js
('b0000000-0000-0000-0000-000000000005', 'fa000000-0000-0000-0000-000000000010', 'Expert'),
('b0000000-0000-0000-0000-000000000005', 'fa000000-0000-0000-0000-000000000002', 'Advanced'),
-- Course 6 (Kubernetes) -> Kubernetes, Docker
('b0000000-0000-0000-0000-000000000006', 'fa000000-0000-0000-0000-000000000011', 'Advanced'),
('b0000000-0000-0000-0000-000000000006', 'fa000000-0000-0000-0000-000000000006', 'Expert'),
-- Course 7 (TypeScript) -> TypeScript, JavaScript
('b0000000-0000-0000-0000-000000000007', 'fa000000-0000-0000-0000-000000000009', 'Expert'),
('b0000000-0000-0000-0000-000000000007', 'fa000000-0000-0000-0000-000000000001', 'Expert'),
-- Course 8 (Distributed Systems) -> System Design
('b0000000-0000-0000-0000-000000000008', 'fa000000-0000-0000-0000-000000000013', 'Expert'),
-- Course 9 (Redis) -> Redis, Database
('b0000000-0000-0000-0000-000000000009', 'fa000000-0000-0000-0000-000000000012', 'Expert'),
('b0000000-0000-0000-0000-000000000009', 'fa000000-0000-0000-0000-000000000005', 'Advanced')
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. LESSONS FOR NEW COURSES
-- ----------------------------------------------------------------------------
-- Course 5: Next.js 15
INSERT INTO lessons (id, course_id, title, slug, description, video_url, content_markdown, order_index, duration_minutes, is_free_preview) VALUES
(
  'ea000000-0000-0000-0000-000000000015',
  'b0000000-0000-0000-0000-000000000005',
  'Next.js 15 App Router & Server Components Fundamentals',
  'nextjs-15-app-router-server-components',
  'Explore the unified component tree where React components render by default on the server.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Server Components vs Client Components
By default in Next.js 15, all components inside the `app/` directory are React Server Components (RSC):
- Zero client bundle size for imported libraries.
- Direct database query execution without client API serialization.
- Enhanced initial page load latency.

```tsx
// app/courses/page.tsx - React Server Component
import { pool } from "@/lib/db";

export default async function CoursesPage() {
  const courses = await pool.query("SELECT * FROM courses WHERE is_published = true");
  return (
    <div className="grid grid-cols-3 gap-6">
      {courses.rows.map(c => <CourseCard key={c.id} course={c} />)}
    </div>
  );
}
```',
  1,
  25,
  true
),
(
  'ea000000-0000-0000-0000-000000000016',
  'b0000000-0000-0000-0000-000000000005',
  'Server Actions, Form State & Optimistic UI Updates',
  'server-actions-form-state-optimistic-ui',
  'Mutate server state without writing REST endpoints using React Server Actions and useOptimistic.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Mutating Data with Server Actions
```tsx
// actions/enrollment.ts
"use server";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  await db.enrollments.create({ data: { courseId, userId: auth().userId } });
  revalidatePath("/dashboard");
}
```',
  2,
  32,
  false
),
(
  'ea000000-0000-0000-0000-000000000017',
  'b0000000-0000-0000-0000-000000000005',
  'Streaming SSR, Suspense Boundaries & Parallel Routes',
  'streaming-ssr-suspense-parallel-routes',
  'Progressively stream rendered HTML chunks to clients using React Suspense and HTTP/2.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Streaming Server Rendering with Suspense
Instant time-to-first-byte (TTFB) while heavy async components stream in:

```tsx
<Suspense fallback={<CourseGridSkeleton />}>
  <AsyncCourseList />
</Suspense>
```',
  3,
  28,
  false
),
(
  'ea000000-0000-0000-0000-000000000018',
  'b0000000-0000-0000-0000-000000000005',
  'Edge Middleware, Static Regeneration & Production Deployment',
  'edge-middleware-isr-production-deployment',
  'Intercept requests at edge CDN nodes for auth verification, redirects, and A/B testing.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Edge Middleware Execution
Next.js middleware runs before the request reaches the server cache or page components.',
  4,
  30,
  false
),

-- Course 6: Kubernetes
(
  'ea000000-0000-0000-0000-000000000019',
  'b0000000-0000-0000-0000-000000000006',
  'Kubernetes Cluster Architecture: Control Plane & Nodes',
  'kubernetes-cluster-architecture-control-plane',
  'Master kube-apiserver, etcd, kube-scheduler, kube-controller-manager, and kubelet.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Kubernetes Architecture Overview
The Control Plane coordinates cluster state stored inside high-availability `etcd`. Worker nodes run the `kubelet` agent and container runtime (containerd).',
  1,
  30,
  true
),
(
  'ea000000-0000-0000-0000-000000000020',
  'b0000000-0000-0000-0000-000000000006',
  'Pods, Deployments, ReplicaSets & Rolling Updates',
  'pods-deployments-replicasets-rolling-updates',
  'Declare declarative desired state and manage zero-downtime rolling deployments.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Declarative Deployment Spec
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: codecrafthub-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```',
  2,
  35,
  false
),
(
  'ea000000-0000-0000-0000-000000000021',
  'b0000000-0000-0000-0000-000000000006',
  'Services, Ingress Routing & TLS Termination with Cert-Manager',
  'services-ingress-routing-tls-cert-manager',
  'Expose microservices via ClusterIP, NodePort, and Nginx Ingress with Let''s Encrypt certificates.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Ingress Traffic Routing
Ingress controllers act as reverse proxies distributing external internet traffic to internal cluster services.',
  3,
  40,
  false
),
(
  'ea000000-0000-0000-0000-000000000022',
  'b0000000-0000-0000-0000-000000000006',
  'StatefulSets, Persistent Volumes & Production Helm Charts',
  'statefulsets-persistent-volumes-helm',
  'Manage stateful services (PostgreSQL, Redis), CSI storage classes, and parameterized Helm packages.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### StatefulSets vs Deployments
StatefulSets maintain stable, unique network identities and persistent disk attachments across pod recreations.',
  4,
  35,
  false
),

-- Course 7: TypeScript Enterprise Architecture
(
  'ea000000-0000-0000-0000-000000000023',
  'b0000000-0000-0000-0000-000000000007',
  'Advanced Generics, Constraints & Conditional Types',
  'advanced-generics-constraints-conditional-types',
  'Master `T extends U ? X : Y` conditional type branching, the `infer` keyword, and generic factories.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### The Power of the `infer` Keyword
Extracting inner types from Promises, arrays, and functions:

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Result = UnwrapPromise<Promise<string>>; // string
```',
  1,
  26,
  true
),
(
  'ea000000-0000-0000-0000-000000000024',
  'b0000000-0000-0000-0000-000000000007',
  'Mapped Types, Template Literals & Key Remapping',
  'mapped-types-template-literals-key-remapping',
  'Construct type-safe event handlers and state mutation matrices using key remapping.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Template Literal Type Remapping
```typescript
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};
```',
  2,
  30,
  false
),
(
  'ea000000-0000-0000-0000-000000000025',
  'b0000000-0000-0000-0000-000000000007',
  'Type-Safe Design Patterns: Factory, Builder & Decorators',
  'type-safe-design-patterns-factory-builder',
  'Apply object-oriented design patterns with compile-time type validation.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Type-Safe Builder Pattern
Enforce that all mandatory properties are configured before `.build()` is callable.',
  3,
  34,
  false
),
(
  'ea000000-0000-0000-0000-000000000026',
  'b0000000-0000-0000-0000-000000000007',
  'Full-Stack Contract Validation with Zod & End-to-End Type Safety',
  'fullstack-contract-validation-zod',
  'Synchronize runtime schema validation with static TypeScript types across client and backend boundaries.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Inferring Static Types from Runtime Schemas
```typescript
import { z } from "zod";

export const CourseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

export type Course = z.infer<typeof CourseSchema>;
```',
  4,
  28,
  false
),

-- Course 8: Distributed Systems
(
  'ea000000-0000-0000-0000-000000000027',
  'b0000000-0000-0000-0000-000000000008',
  'The CAP Theorem, Consensus & Consistency Models',
  'cap-theorem-consensus-consistency-models',
  'Explore linearizability, eventual consistency, Raft consensus algorithm, and partition tolerance.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Understanding CAP & PACELC
In the presence of network partitions (P), a distributed system must choose between Availability (A) or Consistency (C). Else, when running normally (E), choose between Latency (L) and Consistency (C).',
  1,
  35,
  true
),
(
  'ea000000-0000-0000-0000-000000000028',
  'b0000000-0000-0000-0000-000000000008',
  'Event-Driven Messaging with Apache Kafka & RabbitMQ',
  'event-driven-messaging-kafka-rabbitmq',
  'Architect decoupled microservices with log-based event streaming, partitions, consumer groups, and idempotency.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Message Broker vs Distributed Commit Log
RabbitMQ pushes messages to queues; Kafka stores immutable ordered topic partitions consumed at client offsets.',
  2,
  45,
  false
),
(
  'ea000000-0000-0000-0000-000000000029',
  'b0000000-0000-0000-0000-000000000008',
  'Distributed Transactions: The Saga Pattern & Outbox Pattern',
  'distributed-transactions-saga-outbox',
  'Solve distributed consistency across microservice databases using choreography and orchestration sagas.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### The Transactional Outbox Pattern
Atomically write the domain entity and the outbound event to the local database in a single ACID transaction, then reliably publish it via an asynchronous worker.',
  3,
  40,
  false
),
(
  'ea000000-0000-0000-0000-000000000030',
  'b0000000-0000-0000-0000-000000000008',
  'Resilience Patterns: Circuit Breakers, Bulkheads & Observability',
  'resilience-circuit-breakers-bulkheads-observability',
  'Prevent cascading failures using circuit breakers, rate limiters, retries with exponential backoff, and OpenTelemetry.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Circuit Breaker States
Closed (normal traffic) -> Open (short-circuit fails immediately after error threshold) -> Half-Open (trial requests).',
  4,
  35,
  false
),

-- Course 9: Redis Architecture
(
  'ea000000-0000-0000-0000-000000000031',
  'b0000000-0000-0000-0000-000000000009',
  'Redis In-Memory Architecture, Data Structures & Benchmarks',
  'redis-in-memory-architecture-benchmarks',
  'Deep dive into single-threaded event loop, SDS strings, ziplists, skiplists, and sub-millisecond lookups.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Redis Core Data Structures
- **Hashes**: Optimal for object representations without JSON serialization overhead.
- **Sorted Sets (ZSET)**: Real-time leaderboards and sliding-window rate limiters.',
  1,
  24,
  true
),
(
  'ea000000-0000-0000-0000-000000000032',
  'b0000000-0000-0000-0000-000000000009',
  'Cache Eviction Strategies, Cache Stampede & Distributed Locks',
  'cache-eviction-stampede-distributed-locks',
  'Master LRU, LFU, TTL expiration, mutex locks (Redlock), and probabilistic cache regeneration.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Distributed Lock Acquisition with Expiry
```bash
SET resource_lock "uuid_owner" NX PX 30000
```',
  2,
  32,
  false
),
(
  'ea000000-0000-0000-0000-000000000033',
  'b0000000-0000-0000-0000-000000000009',
  'Real-Time Event Streaming with Redis Streams & Pub/Sub',
  'realtime-event-streaming-redis-streams',
  'Build persistent consumer groups and real-time chat with Redis Streams and lightweight Pub/Sub.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### Redis Streams vs Pub/Sub
Pub/Sub is ephemeral (fire-and-forget); Redis Streams persist messages to an append-only log with consumer group acknowledgments (`XACK`).',
  3,
  28,
  false
),
(
  'ea000000-0000-0000-0000-000000000034',
  'b0000000-0000-0000-0000-000000000009',
  'Redis Cluster, Replication & High-Availability Sentinel',
  'redis-cluster-replication-sentinel',
  'Configure master-replica failover, Sentinel quorum monitoring, and 16,384 hash slot cluster sharding.',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  '### High Availability with Redis Sentinel
Sentinels continuously monitor master health, automatically promote replicas upon master failure, and notify clients.',
  4,
  30,
  false
)
ON CONFLICT (course_id, order_index) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown;

-- ----------------------------------------------------------------------------
-- 8. EXTENDED REVIEWS
-- ----------------------------------------------------------------------------
INSERT INTO reviews (user_id, course_id, rating, review_text) VALUES
('da000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 5, 'Next.js 15 Server Components finally made sense after Lesson 1! Sarah''s explanation of RSC streaming is world-class.'),
('da000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 5, 'The Kubernetes ingress and cert-manager walk-through gave me exactly what I needed to configure our team''s staging cluster.'),
('da000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 5, 'The template literal types and mapped key remapping lessons took my TypeScript skills to an architectural level.'),
('da000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000008', 5, 'Superb coverage of the Saga and Outbox patterns for distributed microservice transactions.'),
('da000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 5, 'Clear, battle-tested practical advice on cache stampede prevention and Redis Streams.')
ON CONFLICT (user_id, course_id) DO NOTHING;
