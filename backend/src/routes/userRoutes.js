import { Router } from 'express';
import { getMe, updateMe, getUserById } from '../controllers/userController.js';
import { updateProfileValidator, userIdParamValidator } from '../validators/userValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Current User Profile Management
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, validate(updateProfileValidator), updateMe);

// Public / Community User Details by ID
router.get('/:id', authenticate, validate(userIdParamValidator), getUserById);

export default router;
