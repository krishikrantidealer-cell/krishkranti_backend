const Order = require('../models/Order.model');
const Product = require('../models/Product.model');

const orderController = {
  // POST /orders
  createOrder: async (req, res) => {
    try {
      const { items, shippingAddress, paymentMethod } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Order items are required' });
      }

      // Calculate total amount and verify products
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
        }

        // Check stock availability
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            success: false, 
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
          });
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price, // Store price at point of purchase
        });

        // Update product stock (optional but robust)
        product.stock -= item.quantity;
        await product.save();
      }

      const newOrder = new Order({
        user: req.user._id,
        items: orderItems,
        totalAmount,
        shippingAddress: shippingAddress || req.user.address, // fallback to user's registered address
        paymentMethod: paymentMethod || 'COD',
      });

      await newOrder.save();

      res.status(201).json({ success: true, message: 'Order created successfully', order: newOrder });
    } catch (error) {
      console.error('Create Order error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // GET /orders
  // Users see their own orders, Admins might see all
  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate('items.product', 'name imageUrl')
        .sort('-createdAt');
      
      res.status(200).json({ success: true, count: orders.length, orders });
    } catch (error) {
      console.error('Get Orders error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // GET /orders/:id
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('user', 'firstName lastName phoneNumber')
        .populate('items.product', 'name imageUrl description');

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Basic protection: Ensure user only sees their own order (unless admin potentially)
      if (order.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }

      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error('Get Order By Id error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // PUT /orders/:id/status
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id, 
        { status }, 
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      res.status(200).json({ success: true, message: 'Order status updated', order });
    } catch (error) {
      console.error('Update Order Status error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

module.exports = orderController;
