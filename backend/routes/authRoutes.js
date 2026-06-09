// express.Router import 
const express = require('express');
const router = express.Router();

// authController import
const authController = require('../controllers/authController');

// authMiddleware import
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/register 
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me 
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;