/**
 * Validation middleware
 * Uses express-validator to validate request data
 */

const { validationResult } = require('express-validator');
const { ApiError } = require('./error.middleware');

/**
 * Middleware to validate request data using express-validator
 * @returns {Function} Express middleware
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const formattedErrors = {};
    errors.array().forEach(error => {
      formattedErrors[error.path] = error.msg;
    });

    // Throw API error with validation errors
    return next(ApiError.badRequest('Validation error', formattedErrors));
  };
};

module.exports = {
  validate
};