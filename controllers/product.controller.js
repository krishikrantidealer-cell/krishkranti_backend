const Product = require('../models/Product.model');
const Category = require('../models/Category.model');

const productController = {
  // GET /products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find()
        .populate('category', 'name imageUrl')
        .populate('seller', 'firstName lastName shopName');
      res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
      console.error('Get All Products error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // GET /products/:id
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category', 'name description')
        .populate('seller', 'firstName lastName shopName phoneNumber email');
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error('Get Product By Id error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // GET /products/category/:id
  getProductsByCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const products = await Product.find({ category: categoryId })
        .populate('category', 'name')
        .populate('seller', 'firstName lastName shopName');
      
      res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
      console.error('Get Products By Category error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

module.exports = productController;
