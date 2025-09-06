/**
 * Validation schemas for notification routes
 */

const { param } = require('express-validator');

// Validation for marking a notification as read
const markNotificationReadValidation = [
  param('notificationId')
    .isInt().withMessage('Notification ID must be an integer')
];

// Validation for deleting a notification
const deleteNotificationValidation = [
  param('notificationId')
    .isInt().withMessage('Notification ID must be an integer')
];

module.exports = {
  markNotificationReadValidation,
  deleteNotificationValidation
};