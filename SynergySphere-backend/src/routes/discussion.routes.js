const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussion.controller');
const { verifyToken, isProjectMember } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { createMessageValidation, getMessageThreadValidation, deleteMessageValidation } = require('../validations/discussion.validation');

// Project-specific discussion routes
router.post('/:projectId/messages', verifyToken, isProjectMember, validate(createMessageValidation), discussionController.createMessage);
router.get('/:projectId/messages', verifyToken, isProjectMember, discussionController.getProjectMessages);
router.get('/:projectId/messages/:messageId', verifyToken, isProjectMember, validate(getMessageThreadValidation), discussionController.getMessageThread);
router.delete('/:projectId/messages/:messageId', verifyToken, isProjectMember, validate(deleteMessageValidation), discussionController.deleteMessage);

module.exports = router;