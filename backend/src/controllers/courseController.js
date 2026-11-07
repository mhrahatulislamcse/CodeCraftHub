import { CourseService } from '../services/courseService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * List courses with search, filters, and pagination
 * GET /api/v1/courses
 */
export const listCourses = asyncHandler(async (req, res) => {
  const result = await CourseService.listCourses(req.query, req.user);
  return sendSuccess(res, {
    data: result.courses,
    message: 'Courses retrieved successfully',
    meta: { pagination: result.pagination },
  });
});

/**
 * Get course details with syllabus and instructor
 * GET /api/v1/courses/:id
 */
export const getCourse = asyncHandler(async (req, res) => {
  const course = await CourseService.getCourseDetails(req.params.id, req.user);
  return sendSuccess(res, {
    data: course,
    message: 'Course details retrieved successfully',
  });
});

/**
 * Create a new course (Instructor/Admin)
 * POST /api/v1/courses
 */
export const createCourse = asyncHandler(async (req, res) => {
  const course = await CourseService.createCourse(req.body, req.user);
  return sendSuccess(res, {
    data: course,
    message: 'Course created successfully',
    statusCode: 201,
  });
});

/**
 * Update an existing course
 * PATCH /api/v1/courses/:id
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await CourseService.updateCourse(req.params.id, req.body, req.user);
  return sendSuccess(res, {
    data: course,
    message: 'Course updated successfully',
  });
});

/**
 * Delete a course
 * DELETE /api/v1/courses/:id
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  await CourseService.deleteCourse(req.params.id, req.user);
  return sendSuccess(res, {
    data: null,
    message: 'Course deleted successfully',
  });
});

/**
 * List all categories with course count
 * GET /api/v1/courses/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await CourseService.listCategories();
  return sendSuccess(res, {
    data: categories,
    message: 'Categories retrieved successfully',
  });
});

export default {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
};

