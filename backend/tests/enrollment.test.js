import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Phase 6 - Enrollment & Learning Progress Integration Tests', () => {
  let studentToken = null;
  let studentUser = null;
  let testCourseId = 'b0000000-0000-0000-0000-000000000003'; // Docker Microservices (Course 3)
  let testEnrollmentId = null;
  let generatedCertCode = null;

  beforeAll(async () => {
    // Register a fresh dedicated student for enrollment & progress tests
    const timestamp = Date.now();
    const regRes = await request(app).post('/api/v1/auth/register').send({
      email: `progress.student.${timestamp}@codecrafthub.dev`,
      password: 'Password123!',
      firstName: 'Kaitlyn',
      lastName: 'Dever',
      role: 'student',
    });

    studentToken = regRes.body.data.tokens.accessToken;
    studentUser = regRes.body.data.user;
  });

  describe('Course Enrollment (POST /api/v1/courses/:id/enroll)', () => {
    it('Student should successfully enroll in a course', async () => {
      const res = await request(app)
        .post(`/api/v1/courses/${testCourseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.course_id).toBe(testCourseId);
      expect(res.body.data.status).toBe('active');
      expect(parseFloat(res.body.data.progress_percentage)).toBe(0.0);

      testEnrollmentId = res.body.data.id;
    });

    it('Duplicate enrollment attempt should return 409 Conflict', async () => {
      const res = await request(app)
        .post(`/api/v1/courses/${testCourseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('CONFLICT');
      expect(res.body.error.message).toContain('already enrolled');
    });

    it('Unauthenticated enrollment request should return 401 Unauthorized', async () => {
      const res = await request(app).post(`/api/v1/courses/${testCourseId}/enroll`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('My Enrollments (GET /api/v1/enrollments/me & :id)', () => {
    it('GET /api/v1/enrollments/me should return active user enrollments with metadata', async () => {
      const res = await request(app)
        .get('/api/v1/enrollments/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);

      const enrollment = res.body.data[0];
      expect(enrollment).toHaveProperty('course_title');
      expect(enrollment).toHaveProperty('instructor');
      expect(enrollment.status).toBe('active');
    });

    it('GET /api/v1/enrollments/:id should return single enrollment details', async () => {
      const res = await request(app)
        .get(`/api/v1/enrollments/${testEnrollmentId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(testEnrollmentId);
      expect(res.body.data.course_id).toBe(testCourseId);
    });
  });

  describe('Lesson Progress & Mathematical Trigger Synchronization', () => {
    // In our seed, Course 1 (Production Full-Stack React & Node) has 4 lessons:
    // ea000000-0000-0000-0000-000000000001, ea000000-0000-0000-0000-000000000002,
    // ea000000-0000-0000-0000-000000000003, ea000000-0000-0000-0000-000000000004
    const course1Id = 'b0000000-0000-0000-0000-000000000001';
    const lesson1Id = 'ea000000-0000-0000-0000-000000000001';
    const lesson2Id = 'ea000000-0000-0000-0000-000000000002';
    const lesson3Id = 'ea000000-0000-0000-0000-000000000003';
    const lesson4Id = 'ea000000-0000-0000-0000-000000000004';

    it('Enroll Kaitlyn in Course 1 and complete Lesson 1 (25% progress)', async () => {
      // 1. Enroll
      await request(app)
        .post(`/api/v1/courses/${course1Id}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      // 2. Mark Lesson 1 complete
      const res = await request(app)
        .post(`/api/v1/lessons/${lesson1Id}/complete`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ completed: true, notes: 'Completed architectural overview' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lessonProgress.completed).toBe(true);

      // Trigger should have updated progress to exactly 25.00% (1 of 4 lessons)
      expect(res.body.data.enrollment.progressPercentage).toBe(25.0);
      expect(res.body.data.enrollment.status).toBe('active');
      expect(res.body.data.certificateEarned).toBe(false);
    });

    it('Complete Lessons 2 and 3 (75% progress)', async () => {
      await request(app)
        .post(`/api/v1/lessons/${lesson2Id}/complete`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ completed: true });

      const res = await request(app)
        .post(`/api/v1/lessons/${lesson3Id}/complete`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ completed: true });

      // 3 of 4 lessons = 75.00%
      expect(res.body.data.enrollment.progressPercentage).toBe(75.0);
      expect(res.body.data.enrollment.status).toBe('active');
    });

    it('Complete final Lesson 4 (100% progress) -> Auto-completes & issues certificate', async () => {
      const res = await request(app)
        .post(`/api/v1/lessons/${lesson4Id}/complete`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ completed: true });

      expect(res.status).toBe(200);
      // 4 of 4 lessons = 100.00%
      expect(res.body.data.enrollment.progressPercentage).toBe(100.0);
      expect(res.body.data.enrollment.status).toBe('completed');
      expect(res.body.data.certificateEarned).toBe(true);
      expect(res.body.data.certificate).toHaveProperty('certificate_code');

      generatedCertCode = res.body.data.certificate.certificate_code;
    });

    it('GET /api/v1/progress/courses/:id should return complete syllabus telemetry', async () => {
      const res = await request(app)
        .get(`/api/v1/progress/courses/${course1Id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.enrollment.status).toBe('completed');
      expect(res.body.data.enrollment.progressPercentage).toBe(100.0);
      expect(res.body.data.lessons.every((l) => l.completed)).toBe(true);
      expect(res.body.data.nextLesson).toBeNull(); // All lessons completed
    });
  });

  describe('Student Dashboard Overall Telemetry (GET /api/v1/progress/me)', () => {
    it('should calculate completed courses, learning hours, streak and weekly chart', async () => {
      const res = await request(app)
        .get('/api/v1/progress/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const stats = res.body.data;
      expect(stats.totalEnrolledCourses).toBeGreaterThanOrEqual(2);
      expect(stats.totalCompletedCourses).toBe(1);
      expect(stats.learningHours).toBeGreaterThan(0);
      expect(stats.currentStreakDays).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(stats.weeklyActivity)).toBe(true);
      expect(stats.weeklyActivity.length).toBe(7);
      expect(stats.continueLearning).toBeDefined();
    });
  });

  describe('Certificates (GET /api/v1/certificates/me & verify/:code)', () => {
    it('GET /api/v1/certificates/me should list student earned certificates', async () => {
      const res = await request(app)
        .get('/api/v1/certificates/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].certificate_code).toBe(generatedCertCode);
    });

    it('Public verification endpoint should verify certificate authenticity', async () => {
      const res = await request(app).get(`/api/v1/certificates/verify/${generatedCertCode}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isValid).toBe(true);
      expect(res.body.data.certificateCode).toBe(generatedCertCode);
      expect(res.body.data.studentName).toContain('Kaitlyn Dever');
      expect(res.body.data.courseTitle).toBe('Production Full-Stack React & Node Architecture');
    });

    it('Verification of non-existent code should return 404', async () => {
      const res = await request(app).get('/api/v1/certificates/verify/CCH-9999-FAKE-CODE');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
