import { Router } from 'express';
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  getMyInstructorCourses,
  getInstructorAnalytics,
} from '../controllers/courseController.js';
import { enrollInCourse } from '../controllers/enrollmentController.js';
import {
  getCourseLessons,
  createLesson,
} from '../controllers/lessonController.js';
import {
  createCourseValidator,
  updateCourseValidator,
  courseQueryValidator,
  courseIdParamValidator,
} from '../validators/courseValidator.js';
import { createLessonValidator } from '../validators/lessonValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// 1. Categories & Instructor Studio routes (must precede parameterized /:id route)
router.get('/categories', getCategories);

router.get(
  '/instructor/my-courses',
  authenticate,
  authorize('instructor', 'admin'),
  getMyInstructorCourses
);

router.get(
  '/instructor/analytics',
  authenticate,
  authorize('instructor', 'admin'),
  getInstructorAnalytics
);

// 2. Course Catalog & Discovery
router.get('/', optionalAuth, validate(courseQueryValidator), listCourses);
router.get('/:id', optionalAuth, validate(courseIdParamValidator), getCourse);
router.post('/:id/enroll', authenticate, validate(courseIdParamValidator), enrollInCourse);

// 3. Course Authoring (Instructors & Administrators)
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin'),
  validate(createCourseValidator),
  createCourse
);

router.patch(
  '/:id',
  authenticate,
  authorize('instructor', 'admin'),
  validate(updateCourseValidator),
  updateCourse
);

router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin'),
  deleteCourse
);

// 4. Curriculum / Lessons nested under Course
router.get('/:id/lessons', optionalAuth, getCourseLessons);
router.post(
  '/:id/lessons',
  authenticate,
  authorize('instructor', 'admin'),
  validate(createLessonValidator),
  createLesson
);

export default router;

