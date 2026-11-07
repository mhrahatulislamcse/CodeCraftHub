import { EnrollmentService } from '../services/enrollmentService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Enroll user in a course
 * POST /api/v1/courses/:id/enroll
 */
export const enrollInCourse = asyncHandler(async (req, res) => {
  const result = await EnrollmentService.enrollInCourse(req.user.id, req.params.id);
  return sendSuccess(res, {
    data: result.enrollment,
    message: `Successfully enrolled in ${result.courseTitle}`,
    statusCode: 201,
  });
});

/**
 * Get current user enrollments with course details
 * GET /api/v1/enrollments/me
 */
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await EnrollmentService.getMyEnrollments(req.user.id, req.query);
  return sendSuccess(res, {
    data: enrollments,
    message: 'User enrollments retrieved successfully',
  });
});

/**
 * Get single enrollment by ID
 * GET /api/v1/enrollments/:id
 */
export const getEnrollmentById = asyncHandler(async (req, res) => {
  const enrollment = await EnrollmentService.getEnrollmentDetails(req.params.id, req.user.id);
  return sendSuccess(res, {
    data: enrollment,
    message: 'Enrollment details retrieved successfully',
  });
});

export default {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentById,
};
