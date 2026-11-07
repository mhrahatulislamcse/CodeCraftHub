import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { body } from 'express-validator';
import app from '../src/app.js';
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  DatabaseError,
} from '../src/utils/errors.js';
import { sendSuccess, sendError } from '../src/utils/apiResponse.js';
import { asyncHandler } from '../src/utils/asyncHandler.js';
import { validate } from '../src/middleware/validate.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

describe('Phase 3 - Express Architecture, Middleware & Error Handling Tests', () => {
  describe('Custom Application Errors', () => {
    it('should instantiate error classes with correct status codes and codes', () => {
      const badReq = new BadRequestError('Invalid input');
      expect(badReq.statusCode).toBe(400);
      expect(badReq.errorCode).toBe('BAD_REQUEST');
      expect(badReq.isOperational).toBe(true);

      const unauth = new UnauthorizedError();
      expect(unauth.statusCode).toBe(401);
      expect(unauth.errorCode).toBe('UNAUTHORIZED');

      const forbidden = new ForbiddenError();
      expect(forbidden.statusCode).toBe(403);
      expect(forbidden.errorCode).toBe('FORBIDDEN');

      const notFound = new NotFoundError('Course not found');
      expect(notFound.statusCode).toBe(404);
      expect(notFound.errorCode).toBe('NOT_FOUND');

      const conflict = new ConflictError('Email already registered');
      expect(conflict.statusCode).toBe(409);
      expect(conflict.errorCode).toBe('CONFLICT');

      const validation = new ValidationError('Form errors', [{ field: 'email', message: 'Invalid email' }]);
      expect(validation.statusCode).toBe(422);
      expect(validation.errorCode).toBe('VALIDATION_ERROR');
      expect(validation.details).toHaveLength(1);

      const dbErr = new DatabaseError('Connection timeout');
      expect(dbErr.statusCode).toBe(500);
      expect(dbErr.errorCode).toBe('DATABASE_ERROR');
    });
  });

  describe('Async Handler Wrapper', () => {
    it('should forward thrown errors in async functions to next middleware', async () => {
      const testApp = express();
      testApp.get(
        '/async-fail',
        asyncHandler(async () => {
          throw new BadRequestError('Async error occurred');
        })
      );
      testApp.use(errorHandler);

      const res = await request(testApp).get('/async-fail');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('BAD_REQUEST');
      expect(res.body.error.message).toBe('Async error occurred');
    });
  });

  describe('Validation Middleware with express-validator', () => {
    const testApp = express();
    testApp.use(express.json());

    testApp.post(
      '/test-validate',
      validate([
        body('email').isEmail().withMessage('A valid email address is required'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
      ]),
      (req, res) => {
        sendSuccess(res, { data: req.body, message: 'Validation passed' });
      }
    );
    testApp.use(errorHandler);

    it('should reject invalid payloads with 422 and structured field errors', async () => {
      const res = await request(testApp).post('/test-validate').send({
        email: 'invalid-email',
        password: 'short',
      });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toBeDefined();
      expect(res.body.error.details.length).toBeGreaterThanOrEqual(1);
      expect(res.body.error.details[0]).toHaveProperty('field');
      expect(res.body.error.details[0]).toHaveProperty('message');
    });

    it('should allow valid payloads to proceed with 200', async () => {
      const res = await request(testApp).post('/test-validate').send({
        email: 'developer@example.com',
        password: 'SecurePassword123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Validation passed');
      expect(res.body.data.email).toBe('developer@example.com');
    });
  });

  describe('PostgreSQL and JWT Error Mapping in Global Error Handler', () => {
    it('should translate PostgreSQL unique violation (23505) into 409 CONFLICT', async () => {
      const testApp = express();
      testApp.get('/test-db-unique', (req, res, next) => {
        const err = new Error('duplicate key error');
        err.code = '23505';
        err.detail = 'Key (email)=(student@example.com) already exists.';
        next(err);
      });
      testApp.use(errorHandler);

      const res = await request(testApp).get('/test-db-unique');
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNIQUE_CONSTRAINT_VIOLATION');
      expect(res.body.error.message).toContain('student@example.com');
    });

    it('should translate PostgreSQL invalid syntax (22P02) into 400 BAD_REQUEST', async () => {
      const testApp = express();
      testApp.get('/test-db-syntax', (req, res, next) => {
        const err = new Error('invalid uuid');
        err.code = '22P02';
        next(err);
      });
      testApp.use(errorHandler);

      const res = await request(testApp).get('/test-db-syntax');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_INPUT_SYNTAX');
    });

    it('should translate JsonWebTokenError into 401 UNAUTHORIZED', async () => {
      const testApp = express();
      testApp.get('/test-jwt-err', (req, res, next) => {
        const err = new Error('jwt malformed');
        err.name = 'JsonWebTokenError';
        next(err);
      });
      testApp.use(errorHandler);

      const res = await request(testApp).get('/test-jwt-err');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('Live API Server Endpoints & Telemetry', () => {
    it('GET /api/v1/health should return complete operational metrics and DB latency', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
      expect(res.body.data.services.server.status).toBe('up');
      expect(res.body.data.services.database.status).toBe('connected');
      expect(typeof res.body.data.services.database.latencyMs).toBe('number');
      expect(res.body.data.services.database.pool).toHaveProperty('totalCount');
      expect(res.body.meta).toHaveProperty('timestamp');
    });

    it('GET /api/v1/info should return platform description and supported roles', async () => {
      const res = await request(app).get('/api/v1/info');
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('CodeCraftHub');
      expect(res.body.data.supportedRoles).toEqual(['student', 'instructor', 'admin']);
    });

    it('GET /api/v1/unknown-endpoint should return unified 404 JSON envelope', async () => {
      const res = await request(app).get('/api/v1/unknown-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
      expect(res.body.error.message).toContain('/api/v1/unknown-endpoint');
    });
  });
});
