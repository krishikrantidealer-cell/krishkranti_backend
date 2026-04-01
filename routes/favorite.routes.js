const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply protection to all favorite routes
router.use(protect);

// GET /favorites
router.get('/', favoriteController.getFavorites);

// POST /favorites/toggle
router.post('/toggle', favoriteController.toggleFavorite);

// DELETE /favorites/clear
router.delete('/clear', favoriteController.clearFavorites);

module.exports = router;
