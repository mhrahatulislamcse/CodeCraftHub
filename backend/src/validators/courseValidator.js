import { body, query, param } from 'express-validator';

export const createCourseValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Course title must be between 3 and 255 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('difficultyLevel')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'All Levels'])
    .withMessage('Difficulty level must be Beginner, Intermediate, Advanced, or All Levels'),
  body('thumbnailUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  body('learningObjectives')
    .optional()
    .isArray()
    .withMessage('Learning objectives must be an array of strings'),
  body('prerequisites')
    .optional()
    .isArray()
    .withMessage('Prerequisites must be an array of strings'),
  body('categoryIds')
    .optional()
    .isArray()
    .withMessage('categoryIds must be an array of category UUIDs'),
];

export const updateCourseValidator = [
  param('id')
    .notEmpty()
    .withMessage('Course ID or slug is required'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Course title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('difficultyLevel')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'All Levels'])
    .withMessage('Difficulty level must be Beginner, Intermediate, Advanced, or All Levels'),
  body('thumbnailUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  body('learningObjectives')
    .optional()
    .isArray()
    .withMessage('Learning objectives must be an array of strings'),
  body('prerequisites')
    .optional()
    .isArray()
    .withMessage('Prerequisites must be an array of strings'),
  body('categoryIds')
    .optional()
    .isArray()
    .withMessage('categoryIds must be an array of category UUIDs'),
];

export const courseQueryValidator = [
  query('search')
    .optional()
    .trim(),
  query('difficulty')
    .optional()
    .trim(),
  query('category')
    .optional()
    .trim(),
  query('sortBy')
    .optional()
    .isIn(['created_at', 'rating', 'enrollments', 'hours', 'title'])
    .withMessage('sortBy must be one of: created_at, rating, enrollments, hours, title'),
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('sortOrder must be ASC or DESC'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const courseIdParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('Course ID or slug parameter is required'),
];

export default {
  createCourseValidator,
  updateCourseValidator,
  courseQueryValidator,
  courseIdParamValidator,
};
