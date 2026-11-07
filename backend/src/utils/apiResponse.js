import { config } from '../config/env.js';

/**
 * Standardized Success Response Envelope
 *
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {any} [options.data=null] - Payload returned to client
 * @param {string} [options.message='Success'] - Human-readable success message
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {Object} [options.meta={}] - Additional pagination or contextual metadata
 */
export const sendSuccess = (res, { data = null, message = 'Success', statusCode = 200, meta = {} } = {}) => {
  const response = {
    success: true,
    status: statusCode,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...(res.req ? { path: res.req.originalUrl, method: res.req.method } : {}),
      ...meta,
    },
  };

  return res.status(statusCode).json(response);
};

/**
 * Standardized Error Response Envelope
 *
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {string} [options.message='An error occurred'] - Human-readable error message
 * @param {number} [options.statusCode=500] - HTTP status code
 * @param {string} [options.errorCode='INTERNAL_ERROR'] - Machine-readable code
 * @param {any} [options.details=null] - Granular validation or field errors
 * @param {string} [options.stack=null] - Stack trace (development only)
 * @param {import('express').Request} [options.req=null] - Express request object
 */
export const sendError = (
  res,
  {
    message = 'An unexpected error occurred',
    statusCode = 500,
    errorCode = 'INTERNAL_ERROR',
    details = null,
    stack = null,
    req = null,
  } = {}
) => {
  const currentReq = req || res.req;

  const response = {
    success: false,
    status: statusCode,
    error: {
      code: errorCode,
      message,
      ...(details ? { details } : {}),
      ...(config.env === 'development' && stack ? { stack } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...(currentReq ? { path: currentReq.originalUrl, method: currentReq.method } : {}),
    },
  };

  return res.status(statusCode).json(response);
};

export default {
  sendSuccess,
  sendError,
};
