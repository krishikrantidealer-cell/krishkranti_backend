const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply protection to all order routes
router.use(protect);

// POST /api/orders (Create Order)
router.post('/', orderController.createOrder);

// GET /api/orders (List current user's orders)
router.get('/', orderController.getUserOrders);

// GET /api/orders/:id (Get details of a specific order)
router.get('/:id', orderController.getOrderById);

// PUT /api/orders/:id/status (Updating status - potentially should be admin/staff only)
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
