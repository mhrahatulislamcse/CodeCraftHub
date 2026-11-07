import { LessonService } from '../services/lessonService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get all lessons for a course
 * GET /api/v1/courses/:id/lessons
 */
export const getCourseLessons = asyncHandler(async (req, res) => {
  const lessons = await LessonService.getCourseLessons(req.params.id, req.user);
  return sendSuccess(res, {
    data: lessons,
    message: 'Course curriculum retrieved successfully',
  });
});

/**
 * Get single lesson by ID
 * GET /api/v1/lessons/:id
 */
export const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await LessonService.getLessonById(req.params.id, req.user);
  return sendSuccess(res, {
    data: lesson,
    message: 'Lesson details retrieved successfully',
  });
});

/**
 * Add a lesson to a course
 * POST /api/v1/courses/:id/lessons
 */
export const createLesson = asyncHandler(async (req, res) => {
  const lesson = await LessonService.createLesson(req.params.id, req.body, req.user);
  return sendSuccess(res, {
    data: lesson,
    message: 'Lesson created successfully',
    statusCode: 201,
  });
});

/**
 * Update a lesson
 * PATCH /api/v1/lessons/:id
 */
export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await LessonService.updateLesson(req.params.id, req.body, req.user);
  return sendSuccess(res, {
    data: lesson,
    message: 'Lesson updated successfully',
  });
});

/**
 * Delete a lesson
 * DELETE /api/v1/lessons/:id
 */
export const deleteLesson = asyncHandler(async (req, res) => {
  await LessonService.deleteLesson(req.params.id, req.user);
  return sendSuccess(res, {
    data: null,
    message: 'Lesson deleted successfully',
  });
});

export default {
  getCourseLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
