const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply protection to all payment routes
router.use(protect);

// POST /payments/create-order
router.post('/create-order', paymentController.createRazorpayOrder);

// POST /payments/verify-signature
router.post('/verify-signature', paymentController.verifySignature);

module.exports = router;
