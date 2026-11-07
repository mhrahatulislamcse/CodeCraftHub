import { Router } from 'express';
import {
  toggleLessonProgress,
  getCourseProgress,
  getMyProgressSummary,
} from '../controllers/progressController.js';
import {
  lessonProgressValidator,
  courseProgressParamValidator,
} from '../validators/enrollmentValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Student dashboard overall telemetry, streak & learning activity
router.get('/me', authenticate, getMyProgressSummary);

// Course syllabus completion status
router.get('/courses/:id', authenticate, validate(courseProgressParamValidator), getCourseProgress);

// Toggle lesson completion state
router.post('/lessons/:id/complete', authenticate, validate(lessonProgressValidator), toggleLessonProgress);

export default router;
