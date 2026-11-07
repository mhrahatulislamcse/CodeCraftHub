import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Phase 10 - AI Learning Recommendations & Skill Gap Integration Tests', () => {
  let studentToken;
  let studentId;
  let sampleRecId;

  beforeAll(async () => {
    // Authenticate as seeded student (Marcus Vance)
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'marcus.vance@gmail.com',
        password: 'Password123!',
      });

    expect(loginRes.status).toBe(200);
    studentToken = loginRes.body.data.tokens.accessToken;
    studentId = loginRes.body.data.user.id;
  });

  describe('POST /api/v1/ai/skill-gap', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .send({ targetRole: 'Full-Stack React & Node Engineer' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should calculate skill gap analysis for Full-Stack React role', async () => {
      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'Full-Stack React & Node Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const data = res.body.data;
      expect(data.targetRole).toBe('Full-Stack React & Node Engineer');
      expect(typeof data.matchScore).toBe('number');
      expect(data.matchScore).toBeGreaterThanOrEqual(20);
      expect(data.matchScore).toBeLessThanOrEqual(100);
      expect(Array.isArray(data.verifiedSkills)).toBe(true);
      expect(Array.isArray(data.missingSkills)).toBe(true);
      expect(Array.isArray(data.recommendedCourses)).toBe(true);
      expect(data.readinessLevel).toBeDefined();
    });

    it('should calculate skill gap analysis for Backend Database Architect role', async () => {
      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'Backend & Cloud Database Architect' });

      expect(res.status).toBe(200);
      expect(res.body.data.targetRole).toBe('Backend & Cloud Database Architect');
      expect(res.body.data.missingSkills.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/ai/recommendations/generate', () => {
    it('should generate and persist recommendations grounded in course data', async () => {
      const res = await request(app)
        .post('/api/v1/ai/recommendations/generate')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'Full-Stack React & Node Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.recommendations).toBeDefined();
      expect(Array.isArray(res.body.data.recommendations)).toBe(true);
      expect(res.body.data.recommendations.length).toBeGreaterThan(0);

      const firstRec = res.body.data.recommendations[0];
      expect(firstRec.id).toBeDefined();
      expect(firstRec.reason).toBeDefined();
      expect(firstRec.confidence_score).toBeDefined();
      sampleRecId = firstRec.id;
    });
  });

  describe('GET /api/v1/ai/recommendations/me', () => {
    it('should retrieve active recommendations for the authenticated student', async () => {
      const res = await request(app)
        .get('/api/v1/ai/recommendations/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.recommendations)).toBe(true);
      expect(res.body.data.recommendations.length).toBeGreaterThan(0);

      const rec = res.body.data.recommendations[0];
      expect(rec.user_id).toBe(studentId);
      expect(rec.is_dismissed).toBe(false);
    });
  });

  describe('POST /api/v1/ai/explain', () => {
    it('should explain PostgreSQL B-Tree vs GIN indexing with code example', async () => {
      const res = await request(app)
        .post('/api/v1/ai/explain')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          topic: 'What is the difference between B-Tree and GIN indexes in PostgreSQL?',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.explanation).toContain('B-Tree');
      expect(res.body.data.explanation).toContain('GIN');
      expect(res.body.data.codeExample).toContain('CREATE INDEX');
    });

    it('should explain JWT authentication stateless mechanics', async () => {
      const res = await request(app)
        .post('/api/v1/ai/explain')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          topic: 'How does JWT token authentication work in Express?',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.explanation).toContain('JWT');
      expect(res.body.data.codeExample).toBeDefined();
    });

    it('should reject empty topic with 422 validation error', async () => {
      const res = await request(app)
        .post('/api/v1/ai/explain')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ topic: '' });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/ai/recommendations/:id', () => {
    it('should dismiss a recommendation by ID', async () => {
      if (!sampleRecId) return;

      const res = await request(app)
        .delete(`/api/v1/ai/recommendations/${sampleRecId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.is_dismissed).toBe(true);
    });
  });
});

