import { ProgressService } from '../services/progressService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Toggle lesson completion state
 * POST /api/v1/lessons/:id/complete
 */
export const toggleLessonProgress = asyncHandler(async (req, res) => {
  const completed = req.body.completed !== undefined ? req.body.completed : true;
  const result = await ProgressService.toggleLessonProgress(
    req.user.id,
    req.params.id,
    completed,
    req.body.notes
  );

  return sendSuccess(res, {
    data: result,
    message: completed ? 'Lesson marked as complete' : 'Lesson marked as incomplete',
  });
});

/**
 * Get detailed course progress and syllabus completion
 * GET /api/v1/progress/courses/:id
 */
export const getCourseProgress = asyncHandler(async (req, res) => {
  const progress = await ProgressService.getCourseProgress(req.user.id, req.params.id);
  return sendSuccess(res, {
    data: progress,
    message: 'Course progress retrieved successfully',
  });
});

/**
 * Get student overall dashboard learning statistics & charts
 * GET /api/v1/progress/me
 */
export const getMyProgressSummary = asyncHandler(async (req, res) => {
  const summary = await ProgressService.getStudentDashboardStats(req.user.id);
  return sendSuccess(res, {
    data: summary,
    message: 'Dashboard learning telemetry retrieved successfully',
  });
});

export default {
  toggleLessonProgress,
  getCourseProgress,
  getMyProgressSummary,
};

