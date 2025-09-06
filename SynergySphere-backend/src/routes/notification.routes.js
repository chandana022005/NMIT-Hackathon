const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { markNotificationReadValidation, deleteNotificationValidation } = require('../validations/notification.validation');

// Get all notifications for the current user
router.get('/', verifyToken, notificationController.getUserNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', verifyToken, validate(markNotificationReadValidation), notificationController.markNotificationAsRead);

// Mark all notifications as read
router.patch('/read-all', verifyToken, notificationController.markAllNotificationsAsRead);

// Delete a notification
router.delete('/:notificationId', verifyToken, validate(deleteNotificationValidation), notificationController.deleteNotification);

module.exports = router;