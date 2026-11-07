import { body, param } from 'express-validator';

export const createLessonValidator = [
  param('id')
    .notEmpty()
    .withMessage('Parent course ID or slug is required in URL parameter'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Lesson title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Lesson title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('videoUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('videoUrl must be a valid URL'),
  body('contentMarkdown')
    .optional()
    .trim(),
  body('durationMinutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('durationMinutes must be a positive integer'),
  body('isFreePreview')
    .optional()
    .isBoolean()
    .withMessage('isFreePreview must be a boolean'),
  body('orderIndex')
    .optional()
    .isInt({ min: 1 })
    .withMessage('orderIndex must be a positive integer'),
];

export const updateLessonValidator = [
  param('id')
    .matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    .withMessage('Lesson ID must be a valid UUID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Lesson title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('videoUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('videoUrl must be a valid URL'),
  body('contentMarkdown')
    .optional()
    .trim(),
  body('durationMinutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('durationMinutes must be a positive integer'),
  body('isFreePreview')
    .optional()
    .isBoolean()
    .withMessage('isFreePreview must be a boolean'),
  body('orderIndex')
    .optional()
    .isInt({ min: 1 })
    .withMessage('orderIndex must be a positive integer'),
];

export const lessonIdParamValidator = [
  param('id')
    .matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    .withMessage('Lesson ID must be a valid UUID'),
];

export default {
  createLessonValidator,
  updateLessonValidator,
  lessonIdParamValidator,
};
