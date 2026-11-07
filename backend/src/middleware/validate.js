import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

/**
 * Validation Middleware Factory
 * Executes an array of express-validator rules sequentially and throws a structured ValidationError if any fail.
 *
 * @param {Array} validations - Array of express-validator chains
 * @returns {Function} Express middleware function
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break; // Break early on failure to prevent cascading
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors into a clean, actionable structure
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
      location: err.location,
    }));

    const validationError = new ValidationError('Invalid request payload or query parameters', formattedErrors);
    return next(validationError);
  };
};

export default validate;
