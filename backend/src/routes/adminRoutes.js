import { Router } from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
  toggleCoursePublish,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all admin routes: Requires valid JWT and 'admin' role
router.use(authenticate, authorize('admin'));

// Platform telemetry & metrics
router.get('/stats', getAdminStats);

// User governance
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);

// Course governance
router.patch('/courses/:id/publish', toggleCoursePublish);

export default router;
