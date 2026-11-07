import { sendError } from '../utils/apiResponse.js';

/**
 * 404 Route Not Found Middleware
 * Intercepts unmapped endpoints and produces a structured JSON error envelope.
 */
export const notFoundHandler = (req, res, next) => {
  return sendError(res, {
    message: `Cannot ${req.method} ${req.originalUrl}. Endpoint does not exist.`,
    statusCode: 404,
    errorCode: 'ROUTE_NOT_FOUND',
    req,
  });
};

export default notFoundHandler;
