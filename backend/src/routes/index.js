import { Router } from 'express';
import healthRoutes from './healthRoutes.js';

const router = Router();

// Mount Health & System Information Routes
router.use('/', healthRoutes);

export default router;
