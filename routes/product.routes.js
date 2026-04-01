const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { Timestamp } = require('firebase-admin/firestore');

// GET /api/products
router.get('/', productController.getAllProducts);

// GET /api/products/category/:id
router.get('/category/:id', productController.getProductsByCategory);

// GET /api/products/search
router.get('/search', productController.searchProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;

module.exports.healthcheck = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Product service is healthy",
        version: "1.0.0",
        timestamp: Timestamp.now(),
    })
}

// This is the backend for the product services and all the product api's are listed in this pannel for the future refrenses since moving forward in this project we will need this project for the proper initalization of the course we are dividing that to the direction of the project completion and fastracking the process.