# CodeCraftHub – REST API Specification & Reference Manual

> **Base URL:** `http://localhost:5000/api/v1` (Development)  
> **Production URL:** `https://api.codecrafthub.dev/api/v1`  
> **API Version:** `v1`  
> **Architecture Style:** RESTful JSON with standardized response envelopes  
> **Authentication:** Bearer Token (JSON Web Tokens - Access & Refresh)  

---

## 1. Overview & Architectural Principles

The CodeCraftHub API powers the personalized developer learning management platform. All endpoints strictly adhere to standard HTTP status codes, versioned URI prefixes (`/api/v1`), and deterministic response structures.

### Standard Request Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token>
```

### Standard Response Envelope (Success)
Every successful request returns HTTP `200`, `201`, or `204` with the following root schema:
```json
{
  "success": true,
  "message": "Human-readable summary of the operation",
  "data": { ... },
  "meta": {
    "timestamp": "2026-11-07T11:00:00.000Z",
    "requestId": "cch-req-a1b2c3d4",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

### Standard Error Envelope (Failure)
Errors return standard 4xx or 5xx HTTP status codes with a structured error payload:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested course could not be located",
    "details": null
  },
  "meta": {
    "timestamp": "2026-11-07T11:00:00.000Z",
    "path": "/api/v1/courses/unknown-slug"
  }
}
```

### Common HTTP Status Codes
| Status Code | CodeCraftHub Error Code | Meaning |
| :--- | :--- | :--- |
| `200 OK` | - | Request succeeded. |
| `201 Created` | - | Resource successfully created. |
| `204 No Content` | - | Request succeeded with empty response body. |
| `400 Bad Request` | `BAD_REQUEST` | Malformed request body or syntax error. |
| `401 Unauthorized` | `UNAUTHORIZED` | Missing, expired, or invalid JWT token. |
| `403 Forbidden` | `FORBIDDEN` | Valid token, but insufficient role privileges (e.g., student accessing admin route). |
| `404 Not Found` | `NOT_FOUND` | Resource UUID, slug, or path does not exist. |
| `409 Conflict` | `CONFLICT` | Unique key violation (e.g. duplicate email registration or active duplicate enrollment). |
| `422 Unprocessable` | `VALIDATION_ERROR` | Request schema validation failure (detailed field errors provided). |
| `429 Too Many Req` | `RATE_LIMIT_EXCEEDED`| Request rate limit exceeded for client IP/token. |
| `500 Server Error` | `INTERNAL_SERVER_ERROR` | Unhandled server or database fault. |

---

## 2. System & Health Endpoints

### 2.1 Get System Health
Inspects Node.js runtime metrics and executes a live PostgreSQL heartbeat query (`SELECT 1`) to report roundtrip database latency.

- **Method:** `GET`
- **Path:** `/api/v1/health`
- **Auth Required:** No

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "CodeCraftHub API is fully operational",
  "data": {
    "status": "healthy",
    "uptimeSeconds": 1428.5,
    "environment": "production",
    "database": {
      "status": "connected",
      "latencyMs": 1.42
    },
    "memory": {
      "heapUsedMb": 68.4,
      "rssMb": 112.8
    }
  },
  "meta": {
    "timestamp": "2026-11-07T11:00:00.000Z"
  }
}
```

### 2.2 Get Platform Metadata
Returns version and API documentation links.

- **Method:** `GET`
- **Path:** `/api/v1/info`
- **Auth Required:** No

---

## 3. Authentication & Profile Endpoints (`/api/v1/auth`)

### 3.1 Register New Account
Registers a new developer user. Defaults to role `student`.

- **Method:** `POST`
- **Path:** `/api/v1/auth/register`
- **Auth Required:** No
- **Rate Limit:** 10 requests / 15 minutes

#### Request Body
```json
{
  "name": "Alex Rivera",
  "email": "alex.rivera@example.com",
  "password": "SecurePassword123!",
  "role": "student"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Alex Rivera",
      "email": "alex.rivera@example.com",
      "role": "student",
      "avatarUrl": null,
      "createdAt": "2026-11-07T11:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

### 3.2 Login
Authenticates an existing user and returns dual access + refresh tokens.

- **Method:** `POST`
- **Path:** `/api/v1/auth/login`
- **Auth Required:** No
- **Rate Limit:** 10 requests / 15 minutes

#### Request Body
```json
{
  "email": "marcus.vance@gmail.com",
  "password": "Password123!"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "da000000-0000-0000-0000-000000000001",
      "name": "Marcus Vance",
      "email": "marcus.vance@gmail.com",
      "role": "student",
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

### 3.3 Get Current User (`/me`)
Returns the profile details of the currently authenticated caller.

- **Method:** `GET`
- **Path:** `/api/v1/auth/me`
- **Auth Required:** Yes (Any role)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "id": "da000000-0000-0000-0000-000000000001",
    "name": "Marcus Vance",
    "email": "marcus.vance@gmail.com",
    "role": "student",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "status": "active",
    "bio": "Full-stack developer learning distributed systems",
    "createdAt": "2026-10-01T08:00:00.000Z"
  }
}
```

### 3.4 Refresh Access Token
Issues a fresh access token using a valid refresh token.

- **Method:** `POST`
- **Path:** `/api/v1/auth/refresh-token`
- **Auth Required:** No

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3.5 Change Password
Updates user credentials after validating the current password.

- **Method:** `PATCH`
- **Path:** `/api/v1/auth/change-password`
- **Auth Required:** Yes

#### Request Body
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewSecurePassword2026!"
}
```

### 3.6 Forgot & Reset Password
Initiates a password reset cycle via an email-safe HMAC reset token.

- **POST** `/api/v1/auth/forgot-password` with `{ "email": "user@example.com" }`
- **POST** `/api/v1/auth/reset-password` with `{ "token": "...", "newPassword": "..." }`

---

## 4. Course & Curriculum Endpoints (`/api/v1/courses`, `/api/v1/lessons`)

### 4.1 Browse Course Catalog
Fetches courses with multi-criteria filtering, full-text search, and pagination.

- **Method:** `GET`
- **Path:** `/api/v1/courses`
- **Auth Required:** Optional (Public catalog returns `is_published: true` courses)

#### Query Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search` | string | `""` | Search query matching title, slug, or description. |
| `category` | string | `all` | Filter by category slug (e.g. `backend`, `frontend`, `cloud`). |
| `difficulty`| string | `all` | Filter by `beginner`, `intermediate`, or `advanced`. |
| `sort` | string | `newest` | Sort order: `newest`, `popular`, `rating`, `duration`. |
| `page` | integer| `1` | Page number. |
| `limit` | integer| `12` | Results per page. |

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [
      {
        "id": "ca000000-0000-0000-0000-000000000001",
        "title": "Modern Full-Stack React 19 & Tailwind CSS",
        "slug": "modern-fullstack-react-19-tailwind",
        "description": "Master React 19 Server Components, Actions, and Tailwind v4.",
        "difficulty": "intermediate",
        "category": "frontend",
        "thumbnailUrl": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        "durationMinutes": 360,
        "totalLessons": 12,
        "rating": 4.9,
        "enrolledCount": 142,
        "instructor": {
          "id": "ba000000-0000-0000-0000-000000000001",
          "name": "Sarah Drasner",
          "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 6,
      "totalPages": 1
    }
  }
}
```

### 4.2 Get Course Details by ID or Slug
Retrieves full syllabus outline, learning objectives, instructor bio, and preview status.

- **Method:** `GET`
- **Path:** `/api/v1/courses/:idOrSlug`
- **Auth Required:** Optional

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Course details retrieved successfully",
  "data": {
    "id": "ca000000-0000-0000-0000-000000000001",
    "title": "Modern Full-Stack React 19 & Tailwind CSS",
    "slug": "modern-fullstack-react-19-tailwind",
    "description": "Master React 19 Server Components...",
    "difficulty": "intermediate",
    "category": "frontend",
    "lessons": [
      {
        "id": "ea000000-0000-0000-0000-000000000001",
        "title": "Course Introduction & React 19 Highlights",
        "durationMinutes": 15,
        "orderIndex": 1,
        "isPreview": true,
        "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        "id": "ea000000-0000-0000-0000-000000000002",
        "title": "Deep Dive: React Server Components & Actions",
        "durationMinutes": 35,
        "orderIndex": 2,
        "isPreview": false,
        "videoUrl": null
      }
    ]
  }
}
```

### 4.3 Create Course
Allows an instructor or administrator to publish a new course track.

- **Method:** `POST`
- **Path:** `/api/v1/courses`
- **Auth Required:** Yes (`instructor` or `admin`)

#### Request Body
```json
{
  "title": "Microservices with Node.js & Docker",
  "slug": "microservices-nodejs-docker",
  "description": "Architect, containerize, and orchestrate scalable backend microservices.",
  "difficulty": "advanced",
  "category": "cloud",
  "thumbnailUrl": "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800",
  "isPublished": true
}
```

### 4.4 Lesson Management Endpoints
- `GET /api/v1/courses/:courseId/lessons`: List all syllabus items.
- `POST /api/v1/courses/:courseId/lessons`: Append a lesson (`instructor`/`admin`).
- `GET /api/v1/lessons/:lessonId`: Get lesson content (content locked if not enrolled/preview).
- `PUT /api/v1/lessons/:lessonId`: Update lesson metadata or video URL.
- `DELETE /api/v1/lessons/:lessonId`: Remove lesson from syllabus.

---

## 5. Enrollments & Progress Telemetry (`/api/v1/enrollments`, `/api/v1/progress`)

### 5.1 Enroll in a Course
Creates an active student enrollment record. Idempotent: returns existing enrollment if already registered.

- **Method:** `POST`
- **Path:** `/api/v1/enrollments/courses/:courseId/enroll`
- **Auth Required:** Yes (`student`, `instructor`, `admin`)

#### Response (`201 Created` or `200 OK`)
```json
{
  "success": true,
  "message": "Enrolled in course successfully",
  "data": {
    "id": "fa000000-0000-0000-0000-000000000001",
    "courseId": "ca000000-0000-0000-0000-000000000001",
    "userId": "da000000-0000-0000-0000-000000000001",
    "status": "in_progress",
    "progressPercentage": 0,
    "enrolledAt": "2026-11-07T11:00:00.000Z"
  }
}
```

### 5.2 Get User Enrollments
Returns all courses enrolled by the active user, including completion percentage.

- **Method:** `GET`
- **Path:** `/api/v1/enrollments/me`
- **Auth Required:** Yes

### 5.3 Get Overall Learning Progress & Streak
Returns aggregated learning metrics for the student dashboard.

- **Method:** `GET`
- **Path:** `/api/v1/progress/me`
- **Auth Required:** Yes

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Learning progress retrieved successfully",
  "data": {
    "activeEnrollments": 2,
    "completedCourses": 1,
    "totalHoursSpent": 18.5,
    "currentStreakDays": 5,
    "weeklyActivity": [
      { "day": "Mon", "lessonsCompleted": 2, "minutesSpent": 45 },
      { "day": "Tue", "lessonsCompleted": 1, "minutesSpent": 30 },
      { "day": "Wed", "lessonsCompleted": 0, "minutesSpent": 0 },
      { "day": "Thu", "lessonsCompleted": 3, "minutesSpent": 75 },
      { "day": "Fri", "lessonsCompleted": 2, "minutesSpent": 50 },
      { "day": "Sat", "lessonsCompleted": 4, "minutesSpent": 90 },
      { "day": "Sun", "lessonsCompleted": 1, "minutesSpent": 25 }
    ]
  }
}
```

### 5.4 Toggle / Complete Lesson Progress
Marks a lesson as complete (or incomplete). Triggers automatic PostgreSQL recalculation of overall course progress and certificate issuance if progress hits 100%.

- **Method:** `POST`
- **Path:** `/api/v1/progress/lessons/:lessonId/complete`
- **Auth Required:** Yes

#### Request Body
```json
{
  "completed": true,
  "secondsSpent": 1200
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Lesson progress updated successfully",
  "data": {
    "lessonId": "ea000000-0000-0000-0000-000000000001",
    "isCompleted": true,
    "courseProgressPercentage": 50,
    "courseCompleted": false,
    "certificate": null
  }
}
```

---

## 6. Official Certificates (`/api/v1/certificates`)

### 6.1 Get Earned Certificates
Lists all verified completion certificates earned by the authenticated caller.

- **Method:** `GET`
- **Path:** `/api/v1/certificates/me`
- **Auth Required:** Yes

### 6.2 Public Certificate Verification
Public endpoint enabling employers and recruiters to verify a certificate's cryptographic authenticity.

- **Method:** `GET`
- **Path:** `/api/v1/certificates/verify/:certificateCode`
- **Auth Required:** No

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Certificate verified successfully",
  "data": {
    "certificateCode": "CCH-2026-A1B2-C3D4",
    "recipientName": "Marcus Vance",
    "courseTitle": "Modern Full-Stack React 19 & Tailwind CSS",
    "issueDate": "2026-11-05T14:30:00.000Z",
    "instructorName": "Sarah Drasner",
    "status": "valid",
    "verificationUrl": "https://codecrafthub.dev/verify/CCH-2026-A1B2-C3D4"
  }
}
```

---

## 7. AI Personalized Learning Engine (`/api/v1/ai`)

### 7.1 Skill Gap Analysis
Analyzes user's current progress against a target engineering role (e.g. `Full-Stack Developer`, `Backend Engineer`, `DevOps Engineer`), computing role match percentage, acquired skills, and missing competencies.

- **Method:** `POST`
- **Path:** `/api/v1/ai/skill-gap`
- **Auth Required:** Yes

#### Request Body
```json
{
  "targetRole": "fullstack"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Skill gap analysis calculated",
  "data": {
    "targetRole": "Full-Stack Developer",
    "matchPercentage": 75,
    "acquiredSkills": [
      { "name": "React 19", "level": "Advanced" },
      { "name": "Tailwind CSS v4", "level": "Advanced" },
      { "name": "Express.js", "level": "Intermediate" }
    ],
    "missingSkills": [
      { "name": "PostgreSQL Optimization & Indexing", "priority": "High" },
      { "name": "Docker & Containerization", "priority": "Medium" }
    ],
    "recommendedCourseIds": [
      "ca000000-0000-0000-0000-000000000002",
      "ca000000-0000-0000-0000-000000000005"
    ]
  }
}
```

### 7.2 Interactive AI Concept Explainer
Context-grounded technical tutor answering engineering questions with code snippets.

- **Method:** `POST`
- **Path:** `/api/v1/ai/explain`
- **Auth Required:** Yes

#### Request Body
```json
{
  "concept": "Explain PostgreSQL indexing strategies and B-Tree vs GIN indexes",
  "context": "PostgreSQL Performance Optimization"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Concept explanation generated",
  "data": {
    "topic": "PostgreSQL indexing strategies",
    "explanation": "B-Tree indexes are the default general-purpose index in PostgreSQL...",
    "codeExample": "CREATE INDEX idx_users_email ON users USING btree(email);\nCREATE INDEX idx_courses_tags ON courses USING gin(tags);",
    "keyTakeaways": [
      "B-Tree is optimal for equality and range queries (<, <=, =, >=, >)",
      "GIN (Generalized Inverted Index) is optimal for multi-value types like arrays, JSONB, and full-text search"
    ]
  }
}
```

---

## 8. Instructor & Administrator Endpoints (`/api/v1/admin`, `/api/v1/courses/instructor`)

### 8.1 Instructor Analytics
Returns instructor revenue, total student enrollments, average course ratings, and student engagement telemetry.

- **Method:** `GET`
- **Path:** `/api/v1/courses/instructor/analytics`
- **Auth Required:** Yes (`instructor` or `admin`)

### 8.2 Admin Platform Telemetry
Returns global system health, total registered users, completion counts, and server metrics.

- **Method:** `GET`
- **Path:** `/api/v1/admin/stats`
- **Auth Required:** Yes (`admin` only)

### 8.3 User Governance & Role Management
- `GET /api/v1/admin/users`: List all platform users with filtering by role and status.
- `PATCH /api/v1/admin/users/:userId/role`: Change user role (`student`, `instructor`, `admin`).
- `PATCH /api/v1/admin/users/:userId/status`: Toggle user status (`active`, `suspended`).
- `PATCH /api/v1/admin/courses/:courseId/publish`: Administrative publishing override.

---

## 9. Error Codes Index

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `VALIDATION_ERROR` | 422 | Express validator schema validation failed on one or more payload fields. |
| `INVALID_CREDENTIALS` | 401 | Invalid email or password supplied during login. |
| `TOKEN_EXPIRED` | 401 | JWT access token has expired; client must refresh. |
| `INVALID_TOKEN` | 401 | JWT signature verification failed or token is malformed. |
| `INSUFFICIENT_PERMISSIONS` | 403 | Caller does not possess the requisite RBAC role. |
| `ACCOUNT_SUSPENDED` | 403 | User account has been deactivated by an administrator. |
| `RESOURCE_NOT_FOUND` | 404 | Target entity (course, lesson, user, certificate) was not found. |
| `DUPLICATE_RESOURCE` | 409 | Resource with the same unique identifier (e.g. email, slug) already exists. |
| `RATE_LIMIT_EXCEEDED` | 429 | IP or client exceeded window request limits. |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled exception trapped by central error handler. |
