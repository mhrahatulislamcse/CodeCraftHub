import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import courseRoutes from './courseRoutes.js';
import lessonRoutes from './lessonRoutes.js';

const router = Router();

// Mount System & Health Routes
router.use('/', healthRoutes);

// Mount Authentication & Profile Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Mount Course & Curriculum Routes
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);

export default router;
