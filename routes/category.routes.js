const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// GET /categories
router.get('/', categoryController.getAllCategories);

// GET /categories/:id
router.get('/:id', categoryController.getCategoryById);

module.exports = router;
