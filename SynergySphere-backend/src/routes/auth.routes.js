const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { registerValidation, loginValidation } = require('../validations/auth.validation');

// Register a new user
router.post('/register', validate(registerValidation), authController.register);

// Login user
router.post('/login', validate(loginValidation), authController.login);

// Get user profile (protected route)
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;