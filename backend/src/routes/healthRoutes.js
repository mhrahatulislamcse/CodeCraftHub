import { Router } from 'express';
import { getHealth, getInfo } from '../controllers/healthController.js';

const router = Router();

/**
 * Health check endpoint
 * GET /api/v1/health
 */
router.get('/health', getHealth);

/**
 * Platform meta info endpoint
 * GET /api/v1/info
 */
router.get('/info', getInfo);

export default router;
