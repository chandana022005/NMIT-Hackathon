const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { verifyToken, isProjectMember } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { createProjectValidation, updateProjectValidation, addTeamMemberValidation } = require('../validations/project.validation');

// Create a new project
router.post('/', verifyToken, validate(createProjectValidation), projectController.createProject);

// Get all projects for current user
router.get('/', verifyToken, projectController.getUserProjects);

// Get a single project by ID
router.get('/:projectId', verifyToken, isProjectMember, projectController.getProjectById);

// Update a project
router.put('/:projectId', verifyToken, isProjectMember, validate(updateProjectValidation), projectController.updateProject);

// Delete a project
router.delete('/:projectId', verifyToken, projectController.deleteProject);

// Add a team member to a project
router.post('/:projectId/team', verifyToken, isProjectMember, validate(addTeamMemberValidation), projectController.addTeamMember);

// Remove a team member from a project
router.delete('/:projectId/team/:memberId', verifyToken, projectController.removeTeamMember);

module.exports = router;