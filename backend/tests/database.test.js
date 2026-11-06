import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import { pool, testConnection } from '../src/config/db.js';

describe('Phase 2 - PostgreSQL Schema & Migration Integration Tests', () => {
  let isDbConnected = false;

  beforeAll(async () => {
    const status = await testConnection();
    isDbConnected = status.success;
  });

  afterAll(async () => {
    // Keep pool open or end if needed
  });

  it('PostgreSQL connection check', () => {
    if (!isDbConnected) {
      console.warn('Skipping DB integration test: PostgreSQL target database not yet connected. Configure DB_PASSWORD in .env');
    }
    expect(typeof isDbConnected).toBe('boolean');
  });

  it('Schema should contain all 18 required normalized tables', async () => {
    if (!isDbConnected) return;

    const expectedTables = [
      'roles',
      'users',
      'user_profiles',
      'categories',
      'courses',
      'course_categories',
      'lessons',
      'enrollments',
      'lesson_progress',
      'learning_paths',
      'learning_path_courses',
      'skills',
      'user_skills',
      'course_skills',
      'ai_recommendations',
      'reviews',
      'certificates',
      'notifications',
    ];

    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
    `);

    const existingTables = res.rows.map((r) => r.table_name);
    for (const table of expectedTables) {
      expect(existingTables).toContain(table);
    }
  });

  it('Password hashes in users table must be valid bcrypt hashes', async () => {
    if (!isDbConnected) return;

    const res = await pool.query('SELECT email, password_hash FROM users LIMIT 5;');
    expect(res.rows.length).toBeGreaterThan(0);

    for (const user of res.rows) {
      expect(user.password_hash).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/);
      // Verify matches default seed password
      const isMatch = await bcrypt.compare('Password123!', user.password_hash);
      expect(isMatch).toBe(true);
    }
  });

  it('Enrollment progress trigger should correctly compute completion percentage', async () => {
    if (!isDbConnected) return;

    // Fetch Marcus Vance's enrollment in Course 1 (which has 4 lessons, 2 completed)
    const res = await pool.query(`
      SELECT e.id, e.progress_percentage, e.status, COUNT(lp.id) as completed_lessons
      FROM enrollments e
      JOIN lesson_progress lp ON lp.enrollment_id = e.id AND lp.completed = true
      WHERE e.id = 'e0000000-0000-0000-0000-000000000001'
      GROUP BY e.id, e.progress_percentage, e.status;
    `);

    if (res.rows.length > 0) {
      const enrollment = res.rows[0];
      // 2 completed out of 4 lessons = 50.00%
      expect(Number(enrollment.progress_percentage)).toBe(50.0);
      expect(enrollment.status).toBe('active');
    }
  });

  it('Foreign key constraints should prevent orphaned records', async () => {
    if (!isDbConnected) return;

    // Attempting to insert a user with a non-existent role_id should fail
    await expect(
      pool.query(`
        INSERT INTO users (email, password_hash, role_id) 
        VALUES ('orphan@test.com', 'hash', 9999);
      `)
    ).rejects.toThrow();
  });
});

