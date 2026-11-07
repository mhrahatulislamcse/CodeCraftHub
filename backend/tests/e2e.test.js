import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Phase 12 - End-to-End Platform Integration & Security Suite', () => {
  let studentToken;
  let studentId;
  let testCourseId;
  let testCourseLessons = [];
  let issuedCertificateCode;

  const timestamp = Date.now();
  const testStudentEmail = `e2e.student.${timestamp}@codecrafthub.dev`;
  const testStudentPassword = 'Password123!';

  // STEP 1: Registration & Authentication
  describe('1. Student Onboarding & Session Lifecycle', () => {
    it('should register a new developer student account', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testStudentEmail,
          password: testStudentPassword,
          firstName: 'Elena',
          lastName: 'Rostova',
          role: 'student',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe(testStudentEmail);
      expect(res.body.data.user.role).toBe('student');

      studentToken = res.body.data.tokens.accessToken;
      studentId = res.body.data.user.id;
    });

    it('should verify authenticated session and profile details', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(studentId);
      expect(res.body.data.role).toBe('student');
    });
  });

  // STEP 2: Catalog Discovery & Course Inspection
  describe('2. Course Discovery & Curriculum Exploration', () => {
    it('should search and discover courses from the catalog', async () => {
      const res = await request(app)
        .get('/api/v1/courses?search=PostgreSQL')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      testCourseId = res.body.data[0].id;
    });

    it('should inspect course syllabus before enrollment (isEnrolled: false)', async () => {
      const res = await request(app)
        .get(`/api/v1/courses/${testCourseId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(testCourseId);
      expect(res.body.data.isEnrolled).toBe(false);
      expect(Array.isArray(res.body.data.lessons)).toBe(true);
      testCourseLessons = res.body.data.lessons;
    });
  });

  // STEP 3: AI Skill Gap Analysis
  describe('3. AI Skill Gap Analysis Engine', () => {
    it('should generate pre-enrollment skill gap analysis for target role', async () => {
      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'Backend & Cloud Database Architect' });

      expect(res.status).toBe(200);
      expect(res.body.data.targetRole).toBe('Backend & Cloud Database Architect');
      expect(res.body.data.matchScore).toBeDefined();
      expect(Array.isArray(res.body.data.missingSkills)).toBe(true);
    });
  });

  // STEP 4: Course Enrollment
  describe('4. Course Enrollment Transaction', () => {
    it('should successfully enroll student in the course', async () => {
      const res = await request(app)
        .post(`/api/v1/courses/${testCourseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('active');
      expect(parseFloat(res.body.data.progress_percentage)).toBe(0);
    });

    it('should verify course details now reports isEnrolled: true', async () => {
      const res = await request(app)
        .get(`/api/v1/courses/${testCourseId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isEnrolled).toBe(true);
      expect(res.body.data.enrollment).toBeDefined();
    });
  });

  // STEP 5: Progressive Lesson Completion & Database Trigger Sync
  describe('5. Lesson Completion & Progress Synchronization', () => {
    it('should complete lessons sequentially and verify automatic progress recalculation', async () => {
      expect(testCourseLessons.length).toBeGreaterThan(0);

      // Complete lessons one by one
      for (let i = 0; i < testCourseLessons.length; i++) {
        const lesson = testCourseLessons[i];

        const completeRes = await request(app)
          .post(`/api/v1/progress/lessons/${lesson.id}/complete`)
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ completed: true });

        expect(completeRes.status).toBe(200);
        expect(completeRes.body.success).toBe(true);
      }

      // Verify course progress reached 100%
      const progressRes = await request(app)
        .get(`/api/v1/progress/courses/${testCourseId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(progressRes.status).toBe(200);
      expect(progressRes.body.data.enrollment.progressPercentage).toBe(100);
      expect(progressRes.body.data.enrollment.status).toBe('completed');
    });
  });

  // STEP 6: Certificate Issuance & Verification
  describe('6. Verifiable Certificate Issuance & Public Validation', () => {
    it('should have automatically issued a verified completion certificate', async () => {
      const res = await request(app)
        .get('/api/v1/certificates/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const cert = res.body.data.find((c) => c.course_id === testCourseId);
      expect(cert).toBeDefined();
      expect(cert.certificate_code).toMatch(/^CCH-\d{4}-[0-9A-F]{8}-[0-9A-F]{8}$/);
      issuedCertificateCode = cert.certificate_code;
    });

    it('should validate certificate through public verification endpoint', async () => {
      const res = await request(app)
        .get(`/api/v1/certificates/verify/${issuedCertificateCode}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.certificateCode).toBe(issuedCertificateCode);
      expect(res.body.data.courseTitle).toBeDefined();
    });
  });

  // STEP 7: Student Dashboard Telemetry
  describe('7. Student Dashboard Telemetry & Streaks', () => {
    it('should reflect completed course and hours in dashboard summary', async () => {
      const res = await request(app)
        .get('/api/v1/progress/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.totalEnrolledCourses).toBeGreaterThanOrEqual(1);
      expect(res.body.data.totalCompletedCourses).toBeGreaterThanOrEqual(1);
      expect(res.body.data.learningHours).toBeGreaterThan(0);
      expect(res.body.data.currentStreakDays).toBeGreaterThanOrEqual(1);
    });
  });

  // STEP 8: Security Boundary & RBAC Enforcement
  describe('8. Security Auditing & RBAC Authorization Checks', () => {
    it('should prevent student from accessing admin telemetry (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should prevent student from authoring courses (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ title: 'Unauthorized Course', description: 'Test' });

      expect(res.status).toBe(403);
    });

    it('should safely handle SQL Injection attack payloads in search', async () => {
      const res = await request(app)
        .get(`/api/v1/courses?search=${encodeURIComponent("' OR '1'='1' --")}`);

      // Should return 200 with 0 matches or valid matches, never 500 database error
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject malformed UUID parameters with 422 Unprocessable Entity', async () => {
      const res = await request(app)
        .get('/api/v1/enrollments/not-a-valid-uuid')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });
});
