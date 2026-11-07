import { Router } from 'express';
import {
  getLessonById,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js';
import { toggleLessonProgress } from '../controllers/progressController.js';
import {
  updateLessonValidator,
  lessonIdParamValidator,
} from '../validators/lessonValidator.js';
import { lessonProgressValidator } from '../validators/enrollmentValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Retrieve specific lesson details & workspace content
router.get('/:id', optionalAuth, validate(lessonIdParamValidator), getLessonById);

// Toggle lesson completion state
router.post('/:id/complete', authenticate, validate(lessonProgressValidator), toggleLessonProgress);

// Instructor / Admin management of specific lesson
router.patch(
  '/:id',
  authenticate,
  authorize('instructor', 'admin'),
  validate(updateLessonValidator),
  updateLesson
);

router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin'),
  validate(lessonIdParamValidator),
  deleteLesson
);

export default router;

