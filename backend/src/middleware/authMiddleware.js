import { verifyAccessToken } from '../utils/token.js';
import { UserModel } from '../models/userModel.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * JWT Authentication Middleware
 * Validates the Bearer token in Authorization header, checks active status, and sets req.user.
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication token missing or invalid format (Bearer token required)');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Authentication token is required');
  }

  // Verify and decode JWT
  const decoded = verifyAccessToken(token);

  // Retrieve user record to verify account is still active and valid
  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new UnauthorizedError('Account associated with this token no longer exists');
  }

  if (!user.is_active) {
    throw new ForbiddenError('Account is currently disabled. Please contact support.');
  }

  // Attach safe user object to request
  req.user = user;
  next();
});

/**
 * Role-Based Authorization Guard Factory
 * Enforces access restriction based on user roles (e.g. 'admin', 'instructor', 'student').
 *
 * @param {...string} allowedRoles - Array of authorized role names
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required before authorization check'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Your current role is '${req.user.role}'.`
        )
      );
    }

    next();
  };
};

/**
 * Optional Authentication Middleware
 * Attaches user to req.user if a valid token is provided, but does not block requests if no token is present.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await UserModel.findById(decoded.id);
    if (user && user.is_active) {
      req.user = user;
    }
  } catch (_) {
    // Silently ignore invalid tokens for optional auth
  }

  next();
});

export default {
  authenticate,
  authorize,
  optionalAuth,
};
