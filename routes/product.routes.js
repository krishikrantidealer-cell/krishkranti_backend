const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET /api/products
router.get('/', productController.getAllProducts);

// GET /api/products/category/:id
router.get('/category/:id', productController.getProductsByCategory);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;
