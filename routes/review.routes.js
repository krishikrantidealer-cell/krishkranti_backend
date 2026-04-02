const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /reviews/product/:productId (Always public)
router.get('/product/:productId', reviewController.getProductReviews);

// POST /reviews (Protected)
router.post('/add', protect, reviewController.addReview);

// DELETE /reviews/:id (Protected)
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
