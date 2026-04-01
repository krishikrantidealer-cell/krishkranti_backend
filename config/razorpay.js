const Razorpay = require('razorpay');

// Initialization of Razorpay with credentials from environment
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

module.exports = razorpay;
