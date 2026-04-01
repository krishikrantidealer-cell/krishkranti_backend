const Category = require('../models/Category.model');

const categoryController = {
  // GET /categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json({ success: true, count: categories.length, categories });
    } catch (error) {
      console.error('Get All Categories error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // GET /categories/:id
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.status(200).json({ success: true, category });
    } catch (error) {
      console.error('Get Category By Id error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

module.exports = categoryController;
