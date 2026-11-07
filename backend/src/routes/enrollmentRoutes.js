import { Router } from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentById,
} from '../controllers/enrollmentController.js';
import {
  enrollParamValidator,
  enrollmentIdParamValidator,
  enrollmentQueryValidator,
} from '../validators/enrollmentValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Retrieve user's active & completed enrollments
router.get('/me', authenticate, validate(enrollmentQueryValidator), getMyEnrollments);

// Enroll in a course (alias route)
router.post('/courses/:id/enroll', authenticate, validate(enrollParamValidator), enrollInCourse);

// Retrieve single enrollment details
router.get('/:id', authenticate, validate(enrollmentIdParamValidator), getEnrollmentById);

export default router;
