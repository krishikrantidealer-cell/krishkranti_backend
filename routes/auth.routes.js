const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// POST /auth/verify-otp
// The client verifies the SMS with Firebase, then sends the resulting idToken here
router.post('/verify-otp', authController.verifyOtp);

// POST /auth/register
router.post('/register', authController.register);

// POST /auth/logout
router.post('/logout', authController.logout);

// GET /auth/me (Protected)
router.get('/me', protect, authController.getProfile);

// POST /auth/fcm-token (Protected)
router.post('/fcm-token', protect, authController.updateFcmToken);

// PUT /auth/update-profile (Protected)
router.put('/update-profile', protect, authController.updateProfile);

module.exports = router;
