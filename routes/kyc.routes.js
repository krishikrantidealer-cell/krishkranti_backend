const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kyc.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../utils/multer');

// Configure upload fields based on all possible KYC fields
const kycUpload = upload.fields([
  { name: 'licenseImage', maxCount: 1 },
  { name: 'gstImage', maxCount: 1 },
  { name: 'aadharCardImage', maxCount: 1 }
]);

// POST /kyc/submit (Protected)
router.post('/submit', protect, kycUpload, kycController.submitKyc);

// GET /kyc/status (Protected)
router.get('/status', protect, kycController.getKycStatus);

module.exports = router;
