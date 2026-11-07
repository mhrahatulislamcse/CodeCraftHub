import { UserService } from '../services/userService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get current authenticated user profile
 * GET /api/v1/users/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const profile = await UserService.getMe(req.user.id);
  return sendSuccess(res, {
    data: profile,
    message: 'Profile retrieved successfully',
  });
});

/**
 * Update current authenticated user profile
 * PATCH /api/v1/users/me
 */
export const updateMe = asyncHandler(async (req, res) => {
  const updated = await UserService.updateMe(req.user.id, req.body);
  return sendSuccess(res, {
    data: updated,
    message: 'Profile updated successfully',
  });
});

/**
 * Get public profile of user by ID
 * GET /api/v1/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);
  return sendSuccess(res, {
    data: user,
    message: 'User profile retrieved successfully',
  });
});

export default {
  getMe,
  updateMe,
  getUserById,
};
