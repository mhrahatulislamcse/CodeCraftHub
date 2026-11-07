import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { authorize } from '../src/middleware/authMiddleware.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import express from 'express';

describe('Phase 4 - Authentication & Authorization Integration Tests', () => {
  const timestamp = Date.now();
  const testStudent = {
    email: `test.student.${timestamp}@codecrafthub.dev`,
    password: 'SecurePassword123!',
    firstName: 'Jordan',
    lastName: 'Lee',
    role: 'student',
  };

  let studentToken = null;
  let studentRefreshToken = null;

  describe('POST /api/v1/auth/register', () => {
    it('should register a new student with valid credentials and return tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testStudent);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testStudent.email.toLowerCase());
      expect(res.body.data.user.role).toBe('student');
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');

      // Password hash must never leak in API output
      expect(res.body.data.user).not.toHaveProperty('password');
      expect(res.body.data.user).not.toHaveProperty('password_hash');

      studentToken = res.body.data.tokens.accessToken;
      studentRefreshToken = res.body.data.tokens.refreshToken;
    });

    it('should return 409 Conflict if email is already registered', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testStudent);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('CONFLICT');
    });

    it('should return 422 if password fails complexity requirements', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'weakpass@codecrafthub.dev',
          password: 'weak',
          firstName: 'Bad',
          lastName: 'Pass',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 422 if attempting to register with an invalid role (e.g. admin)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'hacker@codecrafthub.dev',
          password: 'SecurePassword123!',
          firstName: 'Evil',
          lastName: 'Hacker',
          role: 'admin',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should authenticate seeded student with valid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'marcus.vance@gmail.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('marcus.vance@gmail.com');
      expect(res.body.data.tokens).toHaveProperty('accessToken');
    });

    it('should return 401 Unauthorized for incorrect password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'marcus.vance@gmail.com',
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 Unauthorized for non-existent email', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'nobody.exists@codecrafthub.dev',
        password: 'Password123!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Protected Routes & Authorization', () => {
    it('GET /api/v1/auth/me should return user details with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testStudent.email.toLowerCase());
      expect(res.body.data.role).toBe('student');
    });

    it('GET /api/v1/auth/me should reject requests missing authorization header', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should deny student access to admin-only endpoint with 403 Forbidden', async () => {
      const adminTestApp = express();
      adminTestApp.use(express.json());
      // Simulate an admin protected route
      adminTestApp.get(
        '/admin/secret-action',
        (req, res, next) => {
          req.user = { id: 'mock', role: 'student' };
          next();
        },
        authorize('admin'),
        (req, res) => res.json({ success: true })
      );
      adminTestApp.use(errorHandler);

      const res = await request(adminTestApp).get('/admin/secret-action');
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('User Profile Management (GET/PATCH /api/v1/users/me)', () => {
    it('PATCH /api/v1/users/me should update developer headline and bio', async () => {
      const updateData = {
        headline: 'Aspiring Full-Stack Software Architect',
        bio: 'Building modern microservices with Node, Express and React.',
        learningGoals: ['Master PostgreSQL Indexes', 'Build SaaS LMS'],
        preferredDifficulty: 'Intermediate',
      };

      const res = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.headline).toBe(updateData.headline);
      expect(res.body.data.bio).toBe(updateData.bio);
      expect(res.body.data.learning_goals).toEqual(updateData.learningGoals);
    });

    it('GET /api/v1/users/me should return updated profile details', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.headline).toBe('Aspiring Full-Stack Software Architect');
    });
  });

  describe('Password Change & Reset Workflows', () => {
    it('PATCH /api/v1/auth/change-password should change password with correct current password', async () => {
      const res = await request(app)
        .patch('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          currentPassword: testStudent.password,
          newPassword: 'BrandNewPassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify login works with new password
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: testStudent.email,
        password: 'BrandNewPassword123!',
      });
      expect(loginRes.status).toBe(200);
    });

    it('POST /api/v1/auth/forgot-password & POST /api/v1/auth/reset-password workflow', async () => {
      // 1. Request reset token
      const forgotRes = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: testStudent.email });

      expect(forgotRes.status).toBe(200);
      expect(forgotRes.body.data).toHaveProperty('resetToken');
      const resetToken = forgotRes.body.data.resetToken;

      // 2. Perform reset with token
      const resetRes = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'ResetSuccessfulPassword123!',
        });

      expect(resetRes.status).toBe(200);
      expect(resetRes.body.success).toBe(true);

      // 3. Verify single-use guarantee: Re-using the same reset token must fail
      const reuseRes = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'AnotherPassword123!',
        });

      expect(reuseRes.status).toBe(401);
      expect(reuseRes.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    it('should exchange a valid refresh token for a new access token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: studentRefreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should reject invalid or forged refresh tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'invalid.token.signature' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
