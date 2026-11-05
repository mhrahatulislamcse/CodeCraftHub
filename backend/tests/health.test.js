import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Phase 1 - Server Smoke & Health API Tests', () => {
  it('GET / should return platform welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('CodeCraftHub');
  });

  it('GET /api/v1/info should return platform metadata and supported roles', async () => {
    const res = await request(app).get('/api/v1/info');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('CodeCraftHub');
    expect(res.body.data.tagline).toBe('Learn Smarter. Build Better. Grow Faster.');
    expect(res.body.data.supportedRoles).toEqual(['student', 'instructor', 'admin']);
  });

  it('GET /non-existent-route should return structured 404 error', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toHaveProperty('message');
  });
});
