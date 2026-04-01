const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

const cartController = {
  // GET /cart
  getCart: async (req, res) => {
    try {
      let cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product', 'name price imageUrl stock');
      
      if (!cart) {
        // Create an empty cart if not found
        cart = await Cart.create({ user: req.user._id, items: [] });
      }

      res.status(200).json({ success: true, count: cart.items.length, cart });
    } catch (error) {
      console.error('Get Cart error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // POST /cart/add
  addToCart: async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      let cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
      }

      // Find if item already exists in cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists, increment quantity
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        // Product does not exist, add it
        cart.items.push({ product: productId, quantity: Number(quantity) });
      }

      cart.updatedAt = Date.now();
      await cart.save();

      // Return the populated cart
      const savedCart = await Cart.findById(cart._id).populate('items.product', 'name price imageUrl');
      res.status(200).json({ success: true, message: 'Product added to cart', cart: savedCart });
    } catch (error) {
      console.error('Add To Cart error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // PUT /cart/update
  // This updates the exact quantity instead of incrementing
  updateCartItem: async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      if (!productId || quantity === undefined) {
        return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
      }

      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not in cart' });
      }

      if (quantity <= 0) {
        // Remove item if quantity set to 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update to exact amount
        cart.items[itemIndex].quantity = Number(quantity);
      }

      cart.updatedAt = Date.now();
      await cart.save();

      const savedCart = await Cart.findById(cart._id).populate('items.product', 'name price imageUrl');
      res.status(200).json({ success: true, message: 'Cart updated', cart: savedCart });
    } catch (error) {
      console.error('Update Cart error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // DELETE /cart/remove
  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }

      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not in cart' });
      }

      // Remove item
      cart.items.splice(itemIndex, 1);
      cart.updatedAt = Date.now();
      await cart.save();

      const savedCart = await Cart.findById(cart._id).populate('items.product', 'name price imageUrl');
      res.status(200).json({ success: true, message: 'Product removed from cart', cart: savedCart });
    } catch (error) {
      console.error('Remove From Cart error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },
  
  // GET /cart/health
  healthcheck: async (req, res) => {
    res.status(200).json({ success: true, message: 'Cart service is healthy' });
  }
};

module.exports = cartController;
