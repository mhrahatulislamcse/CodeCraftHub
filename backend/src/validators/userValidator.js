import { body, param } from 'express-validator';

export const updateProfileValidator = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('First name cannot exceed 100 characters'),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Last name cannot exceed 100 characters'),
  body('headline')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Headline cannot exceed 255 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Bio cannot exceed 2000 characters'),
  body('avatarUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  body('githubUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('linkedinUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('LinkedIn URL must be a valid URL'),
  body('websiteUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Website URL must be a valid URL'),
  body('learningGoals')
    .optional()
    .isArray()
    .withMessage('Learning goals must be an array of strings'),
  body('preferredDifficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'All Levels'])
    .withMessage('Preferred difficulty must be Beginner, Intermediate, Advanced, or All Levels'),
  body('notificationEmail')
    .optional()
    .isBoolean()
    .withMessage('Notification email must be a boolean'),
  body('notificationInApp')
    .optional()
    .isBoolean()
    .withMessage('Notification in-app must be a boolean'),
];

export const userIdParamValidator = [
  param('id')
    .matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    .withMessage('User ID must be a valid UUID'),
];

export default {
  updateProfileValidator,
  userIdParamValidator,
};

