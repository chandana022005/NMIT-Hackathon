/**
 * Validation schemas for discussion routes
 */

const { body, param } = require('express-validator');

// Validation for creating a message
const createMessageValidation = [
  param('projectId')
    .isInt().withMessage('Project ID must be an integer'),
  
  body('content')
    .notEmpty().withMessage('Message content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Message content must be between 1 and 1000 characters'),
  
  body('parentId')
    .optional()
    .isInt().withMessage('Parent message ID must be an integer')
];

// Validation for getting a message thread
const getMessageThreadValidation = [
  param('projectId')
    .isInt().withMessage('Project ID must be an integer'),
  
  param('messageId')
    .isInt().withMessage('Message ID must be an integer')
];

// Validation for deleting a message
const deleteMessageValidation = [
  param('projectId')
    .isInt().withMessage('Project ID must be an integer'),
  
  param('messageId')
    .isInt().withMessage('Message ID must be an integer')
];

module.exports = {
  createMessageValidation,
  getMessageThreadValidation,
  deleteMessageValidation
};