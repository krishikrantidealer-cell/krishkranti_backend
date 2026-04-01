const Favorite = require('../models/Favorite.model');

const favoriteController = {
  // GET /favorites
  getFavorites: async (req, res) => {
    try {
      let favorite = await Favorite.findOne({ user: req.user._id })
        .populate('products', 'name price imageUrl stock');

      if (!favorite) {
        favorite = await Favorite.create({ user: req.user._id, products: [] });
      }

      res.status(200).json({ success: true, count: favorite.products.length, favorites: favorite.products });
    } catch (error) {
      console.error('Get Favorites error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // POST /favorites/toggle
  toggleFavorite: async (req, res) => {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }

      let favorite = await Favorite.findOne({ user: req.user._id });
      if (!favorite) {
        favorite = new Favorite({ user: req.user._id, products: [] });
      }

      const productIndex = favorite.products.indexOf(productId);
      let message = '';

      if (productIndex > -1) {
        // Remove from favorites
        favorite.products.splice(productIndex, 1);
        message = 'Removed from favorites';
      } else {
        // Add to favorites
        favorite.products.push(productId);
        message = 'Added to favorites';
      }

      favorite.updatedAt = Date.now();
      await favorite.save();

      res.status(200).json({ success: true, message, favorites: favorite.products });
    } catch (error) {
      console.error('Toggle Favorite error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // DELETE /favorites/clear
  clearFavorites: async (req, res) => {
    try {
      await Favorite.findOneAndUpdate({ user: req.user._id }, { products: [] });
      res.status(200).json({ success: true, message: 'Favorites cleared successfully' });
    } catch (error) {
      console.error('Clear Favorites error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

module.exports = favoriteController;
