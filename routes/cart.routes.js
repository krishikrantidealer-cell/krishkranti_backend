const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply protection to all cart routes
router.use(protect);

const couponController = require('../controllers/coupon.controller');

// GET /cart
router.get('/', cartController.getCart);

// POST /cart/add
router.post('/add', cartController.addToCart);

// PUT /cart/update
router.put('/update', cartController.updateCartItem);

// DELETE /cart/remove
router.delete('/remove', cartController.removeFromCart);

// POST /cart/apply-coupon
router.post('/apply-coupon', couponController.applyCouponToCart);

module.exports = router;
