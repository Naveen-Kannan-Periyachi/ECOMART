import express from 'express';
import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
    
    res.json({
      success: true,
      data: wishlist,
      message: 'Wishlist retrieved successfully'
    });
  })
);

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const { productId, notes = '' } = req.body;

    if (!productId) {
      res.status(400);
      throw new Error('Product ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error('Invalid product ID');
    }

    // Check if product exists and is not user's own product
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.owner.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('Cannot add your own product to wishlist');
    }

    try {
      const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
      await wishlist.addProduct(productId, notes);
      
      // Populate the newly added product
      await wishlist.populate({
        path: 'products.product',
        select: 'title price images category type status averageRating reviewCount',
        populate: {
          path: 'owner',
          select: 'name'
        }
      });

      res.status(201).json({
        success: true,
        data: wishlist,
        message: 'Product added to wishlist successfully'
      });
    } catch (error) {
      if (error.message === 'Product already in wishlist') {
        res.status(400);
        throw new Error('Product is already in your wishlist');
      }
      throw error;
    }
  })
);

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
router.delete(
  '/remove/:productId',
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error('Invalid product ID');
    }

    try {
      const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
      await wishlist.removeProduct(productId);
      
      // Populate remaining products
      await wishlist.populate({
        path: 'products.product',
        select: 'title price images category type status averageRating reviewCount',
        populate: {
          path: 'owner',
          select: 'name'
        }
      });

      res.json({
        success: true,
        data: wishlist,
        message: 'Product removed from wishlist successfully'
      });
    } catch (error) {
      if (error.message === 'Product not found in wishlist') {
        res.status(404);
        throw new Error('Product not found in wishlist');
      }
      throw error;
    }
  })
);

// @desc    Update product notes in wishlist
// @route   PUT /api/wishlist/notes/:productId
// @access  Private
router.put(
  '/notes/:productId',
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { notes = '' } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error('Invalid product ID');
    }

    if (notes.length > 200) {
      res.status(400);
      throw new Error('Notes must be less than 200 characters');
    }

    try {
      const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
      await wishlist.updateProductNotes(productId, notes);
      
      // Populate products
      await wishlist.populate({
        path: 'products.product',
        select: 'title price images category type status averageRating reviewCount',
        populate: {
          path: 'owner',
          select: 'name'
        }
      });

      res.json({
        success: true,
        data: wishlist,
        message: 'Product notes updated successfully'
      });
    } catch (error) {
      if (error.message === 'Product not found in wishlist') {
        res.status(404);
        throw new Error('Product not found in wishlist');
      }
      throw error;
    }
  })
);

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
router.get(
  '/check/:productId',
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error('Invalid product ID');
    }

    const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
    const isInWishlist = wishlist.hasProduct(productId);

    res.json({
      success: true,
      data: { isInWishlist },
      message: 'Wishlist check completed'
    });
  })
);

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
router.delete(
  '/clear',
  asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
    await wishlist.clearWishlist();

    res.json({
      success: true,
      data: wishlist,
      message: 'Wishlist cleared successfully'
    });
  })
);

// @desc    Get wishlist summary/statistics
// @route   GET /api/wishlist/summary
// @access  Private
router.get(
  '/summary',
  asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
    const summary = wishlist.getSummary();

    res.json({
      success: true,
      data: summary,
      message: 'Wishlist summary retrieved successfully'
    });
  })
);

// @desc    Move wishlist items to cart (for future cart integration)
// @route   POST /api/wishlist/move-to-cart
// @access  Private
router.post(
  '/move-to-cart',
  asyncHandler(async (req, res) => {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      res.status(400);
      throw new Error('Product IDs array is required');
    }

    // Validate all product IDs
    for (const productId of productIds) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        throw new Error(`Invalid product ID: ${productId}`);
      }
    }

    const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
    
    // Check if all products exist in wishlist
    const validProducts = [];
    for (const productId of productIds) {
      if (wishlist.hasProduct(productId)) {
        validProducts.push(productId);
      }
    }

    if (validProducts.length === 0) {
      res.status(400);
      throw new Error('No valid products found in wishlist');
    }

    // For now, just return the valid products
    // In future, integrate with cart system
    const products = wishlist.products.filter(item => 
      validProducts.includes(item.product._id.toString())
    );

    res.json({
      success: true,
      data: {
        movedProducts: products,
        totalMoved: validProducts.length
      },
      message: `${validProducts.length} products ready to move to cart`
    });
  })
);

// @desc    Get wishlist with filters and sorting
// @route   GET /api/wishlist/filtered
// @access  Private
router.get(
  '/filtered',
  asyncHandler(async (req, res) => {
    const { 
      category, 
      type, 
      minPrice, 
      maxPrice, 
      status = 'available',
      sortBy = 'newest',
      page = 1,
      limit = 20 
    } = req.query;

    const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
    let filteredProducts = [...wishlist.products];

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(item => 
        item.product?.category === category
      );
    }

    if (type) {
      filteredProducts = filteredProducts.filter(item => 
        item.product?.type === type
      );
    }

    if (status) {
      filteredProducts = filteredProducts.filter(item => 
        item.product?.status === status
      );
    }

    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter(item => {
        const price = item.product?.price || 0;
        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filteredProducts.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
        break;
      case 'price-low':
        filteredProducts.sort((a, b) => (a.product?.price || 0) - (b.product?.price || 0));
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => (b.product?.price || 0) - (a.product?.price || 0));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => (b.product?.averageRating || 0) - (a.product?.averageRating || 0));
        break;
      case 'newest':
      default:
        filteredProducts.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        break;
    }

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNext: endIndex < totalProducts,
          hasPrev: parseInt(page) > 1
        },
        filters: {
          category,
          type,
          minPrice,
          maxPrice,
          status,
          sortBy
        }
      },
      message: 'Filtered wishlist retrieved successfully'
    });
  })
);

export default router;