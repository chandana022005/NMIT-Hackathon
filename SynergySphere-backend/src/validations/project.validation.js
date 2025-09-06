/**
 * Validation schemas for project routes
 */

const { body, param } = require('express-validator');

// Validation for creating a project
const createProjectValidation = [
  body('name')
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Project name must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

// Validation for updating a project
const updateProjectValidation = [
  param('id')
    .isInt().withMessage('Project ID must be an integer'),
  
  body('name')
    .optional()
    .isLength({ min: 3, max: 100 }).withMessage('Project name must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

// Validation for adding team member
const addTeamMemberValidation = [
  param('id')
    .isInt().withMessage('Project ID must be an integer'),
  
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('User ID must be an integer'),
  
  body('role')
    .optional()
    .isIn(['MEMBER', 'ADMIN']).withMessage('Role must be either MEMBER or ADMIN')
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
  addTeamMemberValidation
};