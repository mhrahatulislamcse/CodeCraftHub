import { config } from '../config/env.js';

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    status: statusCode,
    error: {
      message,
      ...(err.errors && { details: err.errors }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  };

  // Only include stack trace in development
  if (config.env === 'development') {
    response.error.stack = err.stack;
  }

  // Log 500 errors to console for server diagnostics
  if (statusCode >= 500) {
    console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json(response);
};

export default errorHandler;

