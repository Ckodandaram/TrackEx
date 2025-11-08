const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

// Public routes (no auth required)
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (auth required)
router.get('/me', authMiddleware, userController.getCurrentUser);

module.exports = router;
