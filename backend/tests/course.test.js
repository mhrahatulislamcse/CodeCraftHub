import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Phase 5 - Course & Lesson Management Integration Tests', () => {
  let instructorToken = null;
  let otherInstructorToken = null;
  let studentToken = null;
  let createdCourseId = null;
  let createdLessonId = null;

  beforeAll(async () => {
    // 1. Log in as Instructor 1 (Sarah Drasner)
    const instRes = await request(app).post('/api/v1/auth/login').send({
      email: 'sarah.dr@codecrafthub.dev',
      password: 'Password123!',
    });
    instructorToken = instRes.body.data.tokens.accessToken;

    // 2. Log in as Instructor 2 (Alex Chen)
    const otherInstRes = await request(app).post('/api/v1/auth/login').send({
      email: 'alex.chen@codecrafthub.dev',
      password: 'Password123!',
    });
    otherInstructorToken = otherInstRes.body.data.tokens.accessToken;

    // 3. Log in as Student (Elena Rostova - not enrolled in Course 1)
    const studRes = await request(app).post('/api/v1/auth/login').send({
      email: 'elena.rostova@gmail.com',
      password: 'Password123!',
    });
    studentToken = studRes.body.data.tokens.accessToken;
  });

  describe('Course Catalog & Discovery', () => {
    it('GET /api/v1/courses should return paginated list of published courses', async () => {
      const res = await request(app).get('/api/v1/courses');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.meta).toHaveProperty('pagination');
      expect(res.body.meta.pagination.totalRecords).toBeGreaterThanOrEqual(4);

      const firstCourse = res.body.data[0];
      expect(firstCourse).toHaveProperty('id');
      expect(firstCourse).toHaveProperty('title');
      expect(firstCourse).toHaveProperty('instructor');
      expect(firstCourse).toHaveProperty('categories');
      expect(firstCourse).toHaveProperty('skills');
    });

    it('GET /api/v1/courses?search=React should filter courses by keyword', async () => {
      const res = await request(app).get('/api/v1/courses?search=React');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      const match = res.body.data.some((c) => c.title.includes('React'));
      expect(match).toBe(true);
    });

    it('GET /api/v1/courses?difficulty=Advanced should filter by difficulty level', async () => {
      const res = await request(app).get('/api/v1/courses?difficulty=Advanced');

      expect(res.status).toBe(200);
      res.body.data.forEach((course) => {
        expect(course.difficulty_level).toBe('Advanced');
      });
    });

    it('GET /api/v1/courses/categories should return all categories with course counts', async () => {
      const res = await request(app).get('/api/v1/courses/categories');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);

      const fullStackCat = res.body.data.find((c) => c.slug === 'full-stack-development');
      expect(fullStackCat).toBeDefined();
      expect(fullStackCat.course_count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Course Details (GET /api/v1/courses/:id)', () => {
    it('should return complete course details with instructor and syllabus lessons', async () => {
      const res = await request(app).get('/api/v1/courses/b0000000-0000-0000-0000-000000000001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Production Full-Stack React & Node Architecture');
      expect(res.body.data.instructor.firstName).toBe('Sarah');
      expect(Array.isArray(res.body.data.lessons)).toBe(true);
      expect(res.body.data.lessons.length).toBeGreaterThanOrEqual(4);
    });

    it('should return 404 for non-existent course ID or slug', async () => {
      const res = await request(app).get('/api/v1/courses/non-existent-course-slug');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Course Authoring & Management (POST / PATCH / DELETE /api/v1/courses)', () => {
    it('Instructor should successfully create a new course', async () => {
      const newCoursePayload = {
        title: 'Cloud-Native Microservices with Go & Docker',
        description: 'Comprehensive guide to architecting distributed microservices with Go and Docker containers.',
        difficultyLevel: 'Intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        isPublished: true,
        learningObjectives: ['Design high-throughput APIs', 'Orchestrate multi-service containers'],
        prerequisites: ['Basic command line knowledge'],
      };

      const res = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send(newCoursePayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newCoursePayload.title);
      expect(res.body.data.slug).toContain('cloud-native-microservices-with-go-docker');
      expect(res.body.data.instructor.id).toBeDefined();

      createdCourseId = res.body.data.id;
    });

    it('Student should be forbidden from creating courses (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Unauthorized Course Creation Attempt',
          description: 'Students should not be permitted to create courses.',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('Course owner can update course details', async () => {
      const res = await request(app)
        .patch(`/api/v1/courses/${createdCourseId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          description: 'Updated comprehensive guide to distributed microservices.',
          difficultyLevel: 'Advanced',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.description).toBe('Updated comprehensive guide to distributed microservices.');
      expect(res.body.data.difficulty_level).toBe('Advanced');
    });

    it('Another instructor cannot update someone else course (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/api/v1/courses/${createdCourseId}`)
        .set('Authorization', `Bearer ${otherInstructorToken}`)
        .send({
          title: 'Hacked Course Title',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('Curriculum & Lesson Management', () => {
    it('Instructor can add a lesson to their course', async () => {
      const lessonPayload = {
        title: 'Distributed System Boundaries & RPC Protocols',
        description: 'Deep dive into service boundary isolation and RPC protocols.',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        contentMarkdown: '# RPC Protocols\nDetailed lesson content...',
        durationMinutes: 25,
        isFreePreview: false,
      };

      const res = await request(app)
        .post(`/api/v1/courses/${createdCourseId}/lessons`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send(lessonPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(lessonPayload.title);
      expect(res.body.data.order_index).toBe(1);
      expect(res.body.data.duration_minutes).toBe(25);

      createdLessonId = res.body.data.id;
    });

    it('Unenrolled student sees curriculum with locked status for non-preview lessons', async () => {
      const res = await request(app)
        .get(`/api/v1/courses/${createdCourseId}/lessons`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].isLocked).toBe(true);
      expect(res.body.data[0]).not.toHaveProperty('video_url');
    });

    it('Public user can access free preview lesson directly', async () => {
      // Seeded lesson 1 is free preview
      const res = await request(app).get('/api/v1/lessons/ea000000-0000-0000-0000-000000000001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.is_free_preview).toBe(true);
      expect(res.body.data.video_url).toBeDefined();
    });

    it('Non-preview lesson denies unenrolled student with 403 Forbidden', async () => {
      // Seeded lesson 3 is not free preview and Elena is not enrolled in Course 1
      const res = await request(app)
        .get('/api/v1/lessons/ea000000-0000-0000-0000-000000000003')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('Instructor can update lesson content', async () => {
      const res = await request(app)
        .patch(`/api/v1/lessons/${createdLessonId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          durationMinutes: 30,
          description: 'Updated lesson description.',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.duration_minutes).toBe(30);
    });

    it('Instructor can delete lesson', async () => {
      const res = await request(app)
        .delete(`/api/v1/lessons/${createdLessonId}`)
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Instructor can delete course', async () => {
      const res = await request(app)
        .delete(`/api/v1/courses/${createdCourseId}`)
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
