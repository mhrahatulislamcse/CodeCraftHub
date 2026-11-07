/**
 * Higher-order function to wrap async route handlers
 * Automatically catches unhandled rejections and delegates to Express error middleware.
 *
 * @param {Function} fn - Async express route handler (req, res, next)
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
