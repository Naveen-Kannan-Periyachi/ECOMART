import express from 'express';
import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:id
// @access  Public
router.get(
  '/product/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid product ID');
    }

    // Build sort options
    let sortOptions = { createdAt: -1 }; // Default: newest first
    switch (sort) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'highest':
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOptions = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        // We'll handle this differently since it requires aggregation
        break;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let reviews;
    if (sort === 'helpful') {
      // Sort by helpful count using aggregation
      reviews = await Review.aggregate([
        {
          $match: {
            product: new mongoose.Types.ObjectId(id),
            status: 'active'
          }
        },
        {
          $addFields: {
            helpfulCount: {
              $size: {
                $filter: {
                  input: '$helpful',
                  cond: { $eq: ['$$this.helpful', true] }
                }
              }
            }
          }
        },
        { $sort: { helpfulCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
            pipeline: [{ $project: { name: 1, avatar: 1 } }]
          }
        },
        { $unwind: '$user' }
      ]);
    } else {
      reviews = await Review.find({
        product: id,
        status: 'active'
      })
        .populate('user', 'name avatar')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));
    }

    const totalReviews = await Review.countDocuments({
      product: id,
      status: 'active'
    });

    // Get rating statistics
    const ratingStats = await Review.calculateProductRating(id);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / parseInt(limit)),
          totalReviews,
          hasNext: skip + reviews.length < totalReviews,
          hasPrev: parseInt(page) > 1
        },
        ratingStats
      }
    });
  })
);

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { productId, rating, title, comment, images = [] } = req.body;

    // Validate required fields
    if (!productId || !rating || !title || !comment) {
      res.status(400);
      throw new Error('Please provide all required fields: productId, rating, title, and comment');
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }

    // Create review
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      images: images.map(img => ({
        url: img.url,
        alt: img.alt || 'Review image'
      }))
    });

    // Populate user details
    await review.populate('user', 'name avatar');

    // Update product rating
    const ratingStats = await Review.calculateProductRating(productId);
    await Product.findByIdAndUpdate(productId, {
      averageRating: ratingStats.averageRating,
      reviewCount: ratingStats.totalReviews
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  })
);

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const { rating, title, comment, images } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this review');
    }

    // Update fields if provided
    if (rating !== undefined) review.rating = parseInt(rating);
    if (title) review.title = title.trim();
    if (comment) review.comment = comment.trim();
    if (images) {
      review.images = images.map(img => ({
        url: img.url,
        alt: img.alt || 'Review image'
      }));
    }

    const updatedReview = await review.save();
    await updatedReview.populate('user', 'name avatar');

    // Update product rating
    const ratingStats = await Review.calculateProductRating(review.product);
    await Product.findByIdAndUpdate(review.product, {
      averageRating: ratingStats.averageRating,
      reviewCount: ratingStats.totalReviews
    });

    res.json({
      success: true,
      data: updatedReview,
      message: 'Review updated successfully'
    });
  })
);

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    const ratingStats = await Review.calculateProductRating(productId);
    await Product.findByIdAndUpdate(productId, {
      averageRating: ratingStats.averageRating,
      reviewCount: ratingStats.totalReviews
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  })
);

// @desc    Mark review as helpful or not helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
router.post(
  '/:id/helpful',
  protect,
  asyncHandler(async (req, res) => {
    const { helpful = true } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Remove existing helpful/not helpful from this user
    review.helpful = review.helpful.filter(
      h => h.user.toString() !== req.user._id.toString()
    );

    // Add new helpful/not helpful
    review.helpful.push({
      user: req.user._id,
      helpful: Boolean(helpful)
    });

    await review.save();

    res.json({
      success: true,
      data: {
        helpfulCount: review.helpfulCount,
        notHelpfulCount: review.notHelpfulCount
      },
      message: helpful ? 'Marked as helpful' : 'Marked as not helpful'
    });
  })
);

// @desc    Report a review
// @route   POST /api/reviews/:id/report
// @access  Private
router.post(
  '/:id/report',
  protect,
  asyncHandler(async (req, res) => {
    const { reason } = req.body;

    if (!reason || !['spam', 'inappropriate', 'fake', 'other'].includes(reason)) {
      res.status(400);
      throw new Error('Please provide a valid reason for reporting');
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check if user already reported this review
    const existingReport = review.reported.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingReport) {
      res.status(400);
      throw new Error('You have already reported this review');
    }

    review.reported.push({
      user: req.user._id,
      reason
    });

    // If review has 3 or more reports, set status to pending
    if (review.reported.length >= 3) {
      review.status = 'pending';
    }

    await review.save();

    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  })
);

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
router.get(
  '/my-reviews',
  protect,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'title images price type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / parseInt(limit)),
          totalReviews,
          hasNext: skip + reviews.length < totalReviews,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  })
);

// @desc    Get review summary for product (for product detail page)
// @route   GET /api/reviews/summary/:productId
// @access  Public
router.get(
  '/summary/:productId',
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error('Invalid product ID');
    }

    const summary = await Review.getProductReviewSummary(productId);

    res.json({
      success: true,
      data: summary
    });
  })
);

export default router;