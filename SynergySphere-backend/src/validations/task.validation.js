/**
 * Validation schemas for task routes
 */

const { body, param } = require('express-validator');

// Validation for creating a task
const createTaskValidation = [
  param('projectId')
    .isInt().withMessage('Project ID must be an integer'),
  
  body('title')
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Task title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).withMessage('Status must be TODO, IN_PROGRESS, REVIEW, or DONE'),
  
  body('assignedToId')
    .optional()
    .isInt().withMessage('Assigned user ID must be an integer')
];

// Validation for updating a task
const updateTaskValidation = [
  param('projectId')
    .isInt().withMessage('Project ID must be an integer'),
  
  param('taskId')
    .isInt().withMessage('Task ID must be an integer'),
  
  body('title')
    .optional()
    .isLength({ min: 3, max: 100 }).withMessage('Task title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).withMessage('Status must be TODO, IN_PROGRESS, REVIEW, or DONE'),
  
  body('assignedToId')
    .optional()
    .isInt().withMessage('Assigned user ID must be an integer')
];

module.exports = {
  createTaskValidation,
  updateTaskValidation
};