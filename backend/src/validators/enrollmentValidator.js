import { body, param, query } from 'express-validator';

export const enrollParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('Course ID or slug parameter is required'),
];

export const enrollmentIdParamValidator = [
  param('id')
    .matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    .withMessage('Enrollment ID must be a valid UUID'),
];

export const lessonProgressValidator = [
  param('id')
    .matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    .withMessage('Lesson ID must be a valid UUID'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('completed must be a boolean (true or false)'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

export const courseProgressParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('Course ID or slug parameter is required'),
];

export const certificateCodeParamValidator = [
  param('code')
    .trim()
    .notEmpty()
    .withMessage('Certificate verification code is required'),
];

export const enrollmentQueryValidator = [
  query('status')
    .optional()
    .isIn(['active', 'completed', 'archived', 'paused'])
    .withMessage('Status must be active, completed, archived, or paused'),
];

export default {
  enrollParamValidator,
  enrollmentIdParamValidator,
  lessonProgressValidator,
  courseProgressParamValidator,
  certificateCodeParamValidator,
  enrollmentQueryValidator,
};
