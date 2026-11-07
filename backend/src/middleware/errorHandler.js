import { config } from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';
import { AppError } from '../utils/errors.js';

/**
 * Global Error Handling Middleware
 * Intercepts all errors, normalizes them, and outputs unified JSON error envelopes.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected server error occurred';
  let details = err.details || null;

  // 1. Handle JSON Parsing Syntax Errors (e.g. malformed request body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorCode = 'MALFORMED_JSON_PAYLOAD';
    message = 'Invalid JSON syntax in request body';
  }

  // 2. Handle PostgreSQL Database Errors
  if (err.code) {
    switch (err.code) {
      case '23505': {
        // Unique violation (e.g. duplicate email, unique slug)
        statusCode = 409;
        errorCode = 'UNIQUE_CONSTRAINT_VIOLATION';
        // Extract key details if available (e.g. Key (email)=(test@example.com) already exists.)
        const detailMatch = err.detail?.match(/Key \((.*?)\)=\((.*?)\) already exists/);
        if (detailMatch) {
          message = `Resource with ${detailMatch[1]} '${detailMatch[2]}' already exists`;
          details = { field: detailMatch[1], value: detailMatch[2] };
        } else {
          message = 'A duplicate resource already exists';
        }
        break;
      }
      case '23503': {
        // Foreign key violation
        statusCode = 400;
        errorCode = 'FOREIGN_KEY_VIOLATION';
        message = 'Referenced related record does not exist or cannot be deleted';
        details = err.detail || null;
        break;
      }
      case '22P02': {
        // Invalid text representation (e.g. invalid UUID format)
        statusCode = 400;
        errorCode = 'INVALID_INPUT_SYNTAX';
        message = 'Invalid input syntax format (expected valid UUID or numeric identifier)';
        break;
      }
      case '23502': {
        // Not null violation
        statusCode = 400;
        errorCode = 'NOT_NULL_VIOLATION';
        message = `Required field '${err.column || 'unknown'}' cannot be null`;
        break;
      }
      case 'ECONNREFUSED': {
        statusCode = 503;
        errorCode = 'DATABASE_CONNECTION_REFUSED';
        message = 'Database service is temporarily unavailable';
        break;
      }
      default:
        break;
    }
  }

  // 3. Handle JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Authentication token is invalid or corrupted';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired. Please log in again.';
  }

  // 4. Log server errors (500s) to console for backend diagnostics
  if (statusCode >= 500 && config.env !== 'test') {
    console.error(`[UNHANDLED SERVER ERROR] [${req.method}] ${req.originalUrl}:`, err);
  }

  return sendError(res, {
    message,
    statusCode,
    errorCode,
    details,
    stack: err.stack,
    req,
  });
};

export default errorHandler;
