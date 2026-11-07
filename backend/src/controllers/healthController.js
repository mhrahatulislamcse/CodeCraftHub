import os from 'os';
import { pool, testConnection } from '../config/db.js';
import { config } from '../config/env.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Health Check Controller
 * Provides real-time system and database health telemetry.
 */
export const getHealth = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  let dbLatencyMs = null;
  let dbStatus = null;

  try {
    const pingStart = Date.now();
    await pool.query('SELECT 1;');
    dbLatencyMs = Date.now() - pingStart;
    dbStatus = await testConnection();
  } catch (err) {
    dbStatus = {
      success: false,
      message: 'Failed to query database',
      error: err.message,
    };
  }

  const memory = process.memoryUsage();
  const formatMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const healthData = {
    status: dbStatus.success ? 'healthy' : 'degraded',
    uptimeSeconds: Math.floor(process.uptime()),
    responseTimeMs: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    environment: config.env,
    services: {
      server: {
        status: 'up',
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cpus: os.cpus().length,
        memoryUsage: {
          heapUsed: formatMB(memory.heapUsed),
          heapTotal: formatMB(memory.heapTotal),
          rss: formatMB(memory.rss),
        },
      },
      database: {
        status: dbStatus.success ? 'connected' : 'disconnected',
        database: dbStatus.database || config.db.database,
        host: `${config.db.host}:${config.db.port}`,
        latencyMs: dbLatencyMs,
        pool: {
          totalCount: pool.totalCount,
          idleCount: pool.idleCount,
          waitingCount: pool.waitingCount,
        },
        ...(dbStatus.error ? { error: dbStatus.error } : {}),
      },
    },
  };

  const statusCode = dbStatus.success ? 200 : 503;
  return sendSuccess(res, {
    data: healthData,
    message: dbStatus.success ? 'All systems operational' : 'Database connection degraded',
    statusCode,
  });
});

/**
 * Platform Metadata Controller
 * Returns platform name, tagline, version, and architecture parameters.
 */
export const getInfo = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    data: {
      name: 'CodeCraftHub',
      tagline: 'Learn Smarter. Build Better. Grow Faster.',
      description: 'Personalized Developer Learning Management Platform (LMS)',
      version: '1.0.0',
      apiPrefix: config.apiPrefix,
      supportedRoles: ['student', 'instructor', 'admin'],
      architecture: {
        framework: 'Express.js (ESM)',
        database: 'PostgreSQL 18',
        security: ['Helmet', 'CORS', 'Rate Limiting', 'JWT', 'bcryptjs'],
      },
    },
    message: 'CodeCraftHub API Metadata',
  });
});

export default {
  getHealth,
  getInfo,
};
