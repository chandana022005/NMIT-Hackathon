const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { verifyToken, isProjectMember } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { createTaskValidation, updateTaskValidation } = require('../validations/task.validation');

// Get tasks assigned to current user
router.get('/my-tasks', verifyToken, taskController.getUserTasks);

// Project-specific task routes
router.post('/:projectId/tasks', verifyToken, isProjectMember, validate(createTaskValidation), taskController.createTask);
router.get('/:projectId/tasks', verifyToken, isProjectMember, taskController.getProjectTasks);
router.get('/:projectId/tasks/:taskId', verifyToken, isProjectMember, taskController.getTaskById);
router.put('/:projectId/tasks/:taskId', verifyToken, isProjectMember, validate(updateTaskValidation), taskController.updateTask);
router.delete('/:projectId/tasks/:taskId', verifyToken, isProjectMember, taskController.deleteTask);

module.exports = router;