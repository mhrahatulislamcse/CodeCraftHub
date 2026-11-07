import { UserModel } from '../models/userModel.js';
import { CourseModel } from '../models/courseModel.js';
import { pool } from '../config/db.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get comprehensive platform analytics & DB telemetry
 * GET /api/v1/admin/stats
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  const start = Date.now();
  await pool.query('SELECT 1;');
  const dbLatencyMs = Date.now() - start;

  const stats = await UserModel.getPlatformStats();

  return sendSuccess(res, {
    data: {
      ...stats,
      dbLatencyMs,
      activePoolClients: pool.totalCount || 1,
    },
    message: 'Administrator platform telemetry retrieved successfully',
  });
});

/**
 * Get paginated users list with search & role filter
 * GET /api/v1/admin/users
 */
export const getAdminUsers = asyncHandler(async (req, res) => {
  const result = await UserModel.findAll(req.query);

  return sendSuccess(res, {
    data: result.users,
    message: 'Users retrieved successfully',
    meta: { pagination: result.pagination },
  });
});

/**
 * Update user role (e.g. promote to instructor or admin)
 * PATCH /api/v1/admin/users/:id/role
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const updatedUser = await UserModel.updateRole(req.params.id, role);

  return sendSuccess(res, {
    data: updatedUser,
    message: `User role updated to "${role}"`,
  });
});

/**
 * Toggle user active status (activate/suspend)
 * PATCH /api/v1/admin/users/:id/status
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const updatedUser = await UserModel.updateStatus(req.params.id, isActive);

  return sendSuccess(res, {
    data: updatedUser,
    message: isActive ? 'User account activated' : 'User account suspended',
  });
});

/**
 * Toggle course publication status (Admin or Instructor)
 * PATCH /api/v1/admin/courses/:id/publish
 */
export const toggleCoursePublish = asyncHandler(async (req, res) => {
  const { isPublished } = req.body;
  const updatedCourse = await CourseModel.togglePublish(req.params.id, isPublished);

  return sendSuccess(res, {
    data: updatedCourse,
    message: isPublished ? 'Course published to catalog' : 'Course moved to draft',
  });
});

export default {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
  toggleCoursePublish,
};

