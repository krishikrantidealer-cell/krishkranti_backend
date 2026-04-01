const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Order = require('../models/Order.model');

const paymentController = {
  // 1. Create a Razorpay Order for a specific local order
  // POST /payments/create-order
  createRazorpayOrder: async (req, res) => {
    try {
      const { orderId } = req.body;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const options = {
        amount: order.totalAmount * 100, // Amount in paise (e.g., 10000 = ₹100.00)
        currency: 'INR',
        receipt: `receipt_order_${order._id}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    } catch (error) {
      console.error('Razorpay Order Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // 2. Verify payment signature after frontend completion
  // POST /payments/verify-signature
  verifySignature: async (req, res) => {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        orderId // Our local MongoDB Order ID
      } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        // Payment is verified
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'completed';
          order.status = 'processing';
          await order.save();
        }

        res.status(200).json({ success: true, message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    } catch (error) {
      console.error('Payment Verification Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },
};

module.exports = paymentController;
