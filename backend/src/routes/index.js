import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

// Mount System & Health Routes
router.use('/', healthRoutes);

// Mount Authentication & Profile Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
