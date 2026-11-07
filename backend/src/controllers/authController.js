import { AuthService } from '../services/authService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Register a new user account
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  const result = await AuthService.register({
    email,
    password,
    firstName,
    lastName,
    role,
  });

  return sendSuccess(res, {
    data: result,
    message: 'User registered successfully',
    statusCode: 201,
  });
});

/**
 * Authenticate with credentials
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login({ email, password });

  return sendSuccess(res, {
    data: result,
    message: 'Logged in successfully',
    statusCode: 200,
  });
});

/**
 * Invalidate user session
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  // In stateless JWT architectures, the client discards stored tokens.
  return sendSuccess(res, {
    data: null,
    message: 'Logged out successfully',
    statusCode: 200,
  });
});

/**
 * Get current authenticated user profile
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    data: req.user,
    message: 'User profile retrieved',
  });
});

/**
 * Change account password
 * PATCH /api/v1/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await AuthService.changePassword({
    userId: req.user.id,
    currentPassword,
    newPassword,
  });

  return sendSuccess(res, {
    data: null,
    message: result.message,
    statusCode: 200,
  });
});

/**
 * Initiate password reset workflow
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);

  return sendSuccess(res, {
    data: { resetToken: result.resetToken },
    message: result.message,
    statusCode: 200,
  });
});

/**
 * Complete password reset with token
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await AuthService.resetPassword({ token, newPassword });

  return sendSuccess(res, {
    data: null,
    message: result.message,
    statusCode: 200,
  });
});

/**
 * Refresh access token
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await AuthService.refreshAccessToken(refreshToken);

  return sendSuccess(res, {
    data: result,
    message: 'Token refreshed successfully',
    statusCode: 200,
  });
});

export default {
  register,
  login,
  logout,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
};

