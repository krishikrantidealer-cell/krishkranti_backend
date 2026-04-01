const Coupon = require('../models/Coupon.model');
const Cart = require('../models/Cart.model');

const couponController = {
  // 1. Create a new coupon (Admin)
  // POST /coupons
  createCoupon: async (req, res) => {
    try {
      const {
        code,
        discountType,
        discountAmount,
        minOrderAmount,
        maxDiscountAmount,
        expiryDate,
        usageLimit
      } = req.body;

      if (!code || !discountType || !discountAmount || !expiryDate) {
        return res.status(400).json({ success: false, message: 'All required fields must be provided' });
      }

      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({ success: false, message: 'Coupon code already exists' });
      }

      const newCoupon = new Coupon({
        code: code.toUpperCase(),
        discountType,
        discountAmount,
        minOrderAmount,
        maxDiscountAmount,
        expiryDate: new Date(expiryDate),
        usageLimit
      });

      await newCoupon.save();

      res.status(201).json({ success: true, message: 'Coupon created successfully', coupon: newCoupon });
    } catch (error) {
      console.error('Create Coupon Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // 2. Get all active coupons
  // GET /coupons
  getAllCoupons: async (req, res) => {
    try {
      const activeCoupons = await Coupon.find({
        isActive: true,
        expiryDate: { $gt: Date.now() }
      });
      res.status(200).json({ success: true, count: activeCoupons.length, coupons: activeCoupons });
    } catch (error) {
      console.error('Get All Coupons Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // 3. Delete a coupon
  // DELETE /coupons/:id
  deleteCoupon: async (req, res) => {
    try {
      const result = await Coupon.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Coupon not found' });
      }
      res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
      console.error('Delete Coupon Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // 4. Apply a coupon code to the user's current cart
  // POST /cart/apply-coupon
  applyCouponToCart: async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, message: 'Coupon code is required' });
      }

      const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
      }

      if (coupon.expiryDate < Date.now()) {
        return res.status(400).json({ success: false, message: 'Coupon code has expired' });
      }

      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ success: false, message: 'Coupon code has reached its usage limit' });
      }

      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      // Calculate the current total before discount
      let totalAmount = 0;
      cart.items.forEach(item => {
        totalAmount += item.product.price * item.quantity;
      });

      if (totalAmount < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`
        });
      }

      // Update cart with the applied coupon
      cart.appliedCoupon = coupon._id;
      await cart.save();

      res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        couponCode: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount
      });

    } catch (error) {
      console.error('Apply Coupon Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

module.exports = couponController;
