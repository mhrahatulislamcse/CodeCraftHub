import { Router } from 'express';
import { testConnection } from '../config/db.js';

const router = Router();

/**
 * Health check endpoint
 * GET /api/v1/health
 */
router.get('/health', async (req, res) => {
  const dbStatus = await testConnection();

  const healthData = {
    status: dbStatus.success ? 'healthy' : 'degraded',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      server: {
        status: 'up',
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
      },
      database: {
        status: dbStatus.success ? 'connected' : 'disconnected',
        details: dbStatus.message,
        ...(dbStatus.error && { error: dbStatus.error }),
      },
    },
  };

  const statusCode = dbStatus.success ? 200 : 503;
  res.status(statusCode).json({
    success: dbStatus.success,
    data: healthData,
  });
});

/**
 * Platform meta info
 * GET /api/v1/info
 */
router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'CodeCraftHub',
      tagline: 'Learn Smarter. Build Better. Grow Faster.',
      description: 'Personalized Developer Learning Platform (LMS)',
      version: '1.0.0',
      apiPrefix: '/api/v1',
      supportedRoles: ['student', 'instructor', 'admin'],
    },
  });
});

export default router;

