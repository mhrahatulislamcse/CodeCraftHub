import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { corsMiddleware } from './middleware/corsConfig.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing
app.use(corsMiddleware);

// 3. Request Rate Limiting (Applied to all API routes)
app.use(config.apiPrefix, apiLimiter);

// 4. Request Body Parsing with Safety Limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. HTTP Request Logging (dev format in non-test environments)
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// 6. Root Platform Landing Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CodeCraftHub API - Learn Smarter. Build Better. Grow Faster.',
    documentation: `${config.apiPrefix}/info`,
    health: `${config.apiPrefix}/health`,
  });
});

// 7. Mount Versioned REST API Router (/api/v1)
app.use(config.apiPrefix, apiRouter);

// 8. Handle 404 Route Not Found
app.use(notFoundHandler);

// 9. Centralized Global Error Handler
app.use(errorHandler);

export default app;
