const express = require('express');
const router = express.Router();

// @route   GET /api/test/ping
// @desc    Basic ping to test server status
router.get('/ping', (req, res) => {
  res.json({ message: 'Krishi Kranti API is online!' });
});

module.exports = router;
