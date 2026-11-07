import { body, param } from 'express-validator';

export const skillGapValidator = [
  body('targetRole')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Target role must be a string between 2 and 100 characters'),
];

export const explainConceptValidator = [
  body('topic')
    .notEmpty()
    .withMessage('Topic or technical question is required')
    .isString()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Topic must be between 2 and 200 characters'),
  body('context')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Context cannot exceed 500 characters'),
];

export const recommendationIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Recommendation ID is required')
    .matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    .withMessage('Recommendation ID must be a valid UUID'),
];

export default {
  skillGapValidator,
  explainConceptValidator,
  recommendationIdValidator,
};

