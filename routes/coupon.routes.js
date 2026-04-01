const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply protection to all coupon routes
router.use(protect);

// POST /coupons (Create a Coupon - potentially should be admin only)
router.post('/', couponController.createCoupon);

// GET /coupons (List all coupons available to the user)
router.get('/', couponController.getAllCoupons);

// DELETE /coupons/:id (Delete a coupon)
router.delete('/:id', couponController.deleteCoupon);

// POST /coupons/apply (Apply a coupon code to the user's current session)
router.post('/apply', couponController.applyCouponToCart);

module.exports = router;
