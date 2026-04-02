const Review = require('../models/Review.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');

const reviewController = {
  // POST /reviews
  addReview: async (req, res) => {
    try {
      const { productId, rating, comment } = req.body;
      const userId = req.user._id;

      if (!productId || !rating) {
        return res.status(400).json({ success: false, message: 'Product ID and rating are required' });
      }

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Check if user has ordered this product
      const hasOrdered = await Order.findOne({
        user: userId,
        'items.product': productId,
        status: { $ne: 'cancelled' } // Ensure order wasn't cancelled
      });

      if (!hasOrdered) {
        return res.status(403).json({ success: false, message: 'You can only review products you have ordered' });
      }

      // Check if user already reviewed
      const alreadyReviewed = await Review.findOne({ user: userId, product: productId });
      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
      }

      const review = new Review({
        product: productId,
        user: userId,
        rating: Number(rating),
        comment
      });

      await review.save();

      // Update product average rating and numReviews
      const reviews = await Review.find({ product: productId });
      const numReviews = reviews.length;
      const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

      await Product.findByIdAndUpdate(productId, {
        averageRating: Number(averageRating.toFixed(1)),
        numReviews
      });

      res.status(201).json({ success: true, message: 'Review added successfully', review });
    } catch (error) {
      console.error('Add Review error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // GET /reviews/product/:productId
  getProductReviews: async (req, res) => {
    try {
      const reviews = await Review.find({ product: req.params.productId })
        .populate('user', 'firstName lastName')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, count: reviews.length, reviews });
    } catch (error) {
      console.error('Get Reviews error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  // DELETE /reviews/:id
  deleteReview: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      // Only the reviewer can delete their review
      if (review.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: 'Not authorized to delete this review' });
      }

      const productId = review.product;
      await Review.deleteOne({ _id: req.params.id });

      // Update product average rating and numReviews
      const remainingReviews = await Review.find({ product: productId });
      const numReviews = remainingReviews.length;
      const averageRating = numReviews > 0 
        ? remainingReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews 
        : 0;

      await Product.findByIdAndUpdate(productId, {
        averageRating: Number(averageRating.toFixed(1)),
        numReviews
      });

      res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete Review error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

module.exports = reviewController;
