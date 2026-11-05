import app from './app.js';
import { config } from './config/env.js';
import { testConnection, pool } from './config/db.js';

const startServer = async () => {
  try {
    console.log('='.repeat(55));
    console.log('  CodeCraftHub - Personalized Developer Learning Platform');
    console.log('='.repeat(55));
    console.log(`[Environment]: ${config.env}`);
    console.log(`[API Prefix]:  ${config.apiPrefix}`);
    console.log(`[Port]:        ${config.port}`);

    // Verify database connection
    const dbStatus = await testConnection();
    if (dbStatus.success) {
      console.log(`[Database]:    CONNECTED to PostgreSQL (${dbStatus.database})`);
    } else {
      console.warn(`[Database]:    WARNING - ${dbStatus.message}`);
      if (dbStatus.error) {
        console.warn(`               Detail: ${dbStatus.error}`);
        console.warn('               Note: Check DB_PASSWORD and DB_NAME in backend/.env');
      }
    }

    const server = app.listen(config.port, () => {
      console.log(`[Server]:      RUNNING on http://localhost:${config.port}`);
      console.log(`[Health URL]:  http://localhost:${config.port}${config.apiPrefix}/health`);
      console.log('='.repeat(55));
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n[Server]: Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('[Server]: HTTP server closed.');
        try {
          await pool.end();
          console.log('[Database]: Connection pool closed.');
        } catch (err) {
          console.error('[Database]: Error closing pool:', err.message);
        }
        process.exit(0);
      });

      // Force shutdown after timeout
      setTimeout(() => {
        console.error('[Server]: Forceful shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Unhandled Rejection at]:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('[Uncaught Exception]:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('[Server Fatal Error]:', error);
    process.exit(1);
  }
};

startServer();

