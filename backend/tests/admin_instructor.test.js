import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Phase 11 - Instructor and Administrator Dashboards Integration Tests', () => {
  let adminToken;
  let instructorToken;
  let studentToken;
  let studentId;
  let createdCourseId;

  beforeAll(async () => {
    // 1. Admin login
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@codecrafthub.dev', password: 'Password123!' });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.data.tokens.accessToken;

    // 2. Instructor login (Sarah Drasner)
    const instRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'sarah.dr@codecrafthub.dev', password: 'Password123!' });
    expect(instRes.status).toBe(200);
    instructorToken = instRes.body.data.tokens.accessToken;

    // 3. Student login (Marcus Vance)
    const studentRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'marcus.vance@gmail.com', password: 'Password123!' });
    expect(studentRes.status).toBe(200);
    studentToken = studentRes.body.data.tokens.accessToken;
    studentId = studentRes.body.data.user.id;
  });

  describe('Instructor Studio & Course Management APIs', () => {
    it('should reject student from accessing instructor studio with 403', async () => {
      const res = await request(app)
        .get('/api/v1/courses/instructor/my-courses')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow instructor to view their created courses', async () => {
      const res = await request(app)
        .get('/api/v1/courses/instructor/my-courses')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should retrieve instructor aggregate metrics', async () => {
      const res = await request(app)
        .get('/api/v1/courses/instructor/analytics')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total_courses).toBeDefined();
      expect(res.body.data.total_students_enrolled).toBeDefined();
    });

    it('should allow instructor to create a new course in the studio', async () => {
      const newCourse = {
        title: 'High-Concurrency Redis & Caching Architecture',
        description: 'Implement distributed locking, cache-aside strategies, and memory optimization.',
        difficultyLevel: 'Intermediate',
        estimatedHours: 10.5,
        isPublished: true,
        learningObjectives: ['Implement cache-aside pattern', 'Configure pub/sub events'],
        prerequisites: ['Basic backend knowledge'],
      };

      const res = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send(newCourse);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newCourse.title);
      createdCourseId = res.body.data.id;
    });

    it('should allow instructor to add a lesson to their newly created course', async () => {
      const newLesson = {
        title: 'Redis In-Memory Architecture & Key Expiration',
        description: 'Understand single-threaded event loops and volatile-lru memory eviction.',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        contentMarkdown: '### Redis Memory Management\nConfigure `maxmemory-policy` appropriately.',
        durationMinutes: 20,
        orderIndex: 1,
        isFreePreview: true,
      };

      const res = await request(app)
        .post(`/api/v1/courses/${createdCourseId}/lessons`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send(newLesson);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newLesson.title);
    });
  });

  describe('Administrator Platform Governance APIs', () => {
    it('should reject non-admin from accessing admin stats with 403', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow administrator to retrieve platform stats and DB health', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total_users).toBeGreaterThan(0);
      expect(res.body.data.total_courses).toBeGreaterThan(0);
      expect(res.body.data.dbLatencyMs).toBeDefined();
    });

    it('should allow administrator to retrieve paginated users list', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users?limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta.pagination.totalRecords).toBeGreaterThan(0);
    });

    it('should allow administrator to toggle user active status', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/users/${studentId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.status).toBe(200);
      expect(res.body.data.is_active).toBe(false);

      // Re-activate student
      await request(app)
        .patch(`/api/v1/admin/users/${studentId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: true });
    });

    it('should allow administrator to toggle course publication status', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/courses/${createdCourseId}/publish`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isPublished: false });

      expect(res.status).toBe(200);
      expect(res.body.data.is_published).toBe(false);
    });
  });
});
