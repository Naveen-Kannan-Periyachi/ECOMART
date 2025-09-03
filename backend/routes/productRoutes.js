import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Activity from '../models/Activity.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateProduct, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
router.post(
  '/',
  protect,
  validateProduct,
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      price,
      rentPricePerDay,
      category,
      condition,
      type,
      images,
      location,
    } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      rentPricePerDay,
      category,
      condition,
      type,
      images,
      location,
      owner: req.user._id,
    });

    if (product) {
      res.status(201).json(product);
    } else {
      res.status(400);
      throw new Error('Invalid product data');
    }
  })
);

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      category,
      type,
      condition,
      minPrice,
      maxPrice,
      location,
      search,
    } = req.query;

    let query = {};

    if (category) query.category = category;
    if (type) query.type = type;
    if (condition) query.condition = condition;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(products);
  })
);

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
router.get(
  '/trending',
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const trendingProducts = await Activity.aggregate([
      {
        $match: {
          action: { $in: ['viewed', 'bought', 'rented'] },
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$productId',
          viewCount: {
            $sum: {
              $cond: [{ $eq: ['$action', 'viewed'] }, 1, 0]
            }
          },
          buyCount: {
            $sum: {
              $cond: [{ $eq: ['$action', 'bought'] }, 3, 0] // Weight purchases higher
            }
          },
          rentCount: {
            $sum: {
              $cond: [{ $eq: ['$action', 'rented'] }, 2, 0] // Weight rentals moderately
            }
          }
        }
      },
      {
        $addFields: {
          trendScore: {
            $add: ['$viewCount', '$buyCount', '$rentCount']
          }
        }
      },
      {
        $sort: { trendScore: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'product.owner',
          foreignField: '_id',
          as: 'product.owner',
          pipeline: [
            { $project: { name: 1, email: 1 } }
          ]
        }
      },
      {
        $unwind: '$product.owner'
      },
      {
        $addFields: {
          'product.trendScore': '$trendScore'
        }
      },
      {
        $replaceRoot: { newRoot: '$product' }
      }
    ]);

    // If no trending products, get recent popular products
    if (trendingProducts.length < limit) {
      const recentProducts = await Product.find({
        _id: { $nin: trendingProducts.map(p => p._id) }
      })
      .populate('owner', 'name email')
      .sort({ createdAt: -1, views: -1 })
      .limit(limit - trendingProducts.length);

      res.json({
        success: true,
        count: [...trendingProducts, ...recentProducts].length,
        data: [...trendingProducts, ...recentProducts]
      });
    } else {
      res.json({
        success: true,
        count: trendingProducts.length,
        data: trendingProducts
      });
    }
  })
);

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
router.put(
  '/:id',
  protect,
  validateProduct,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.owner.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this product');
      }

      // Update only provided fields
      const {
        title,
        description,
        price,
        rentPricePerDay,
        category,
        condition,
        type,
        images,
        location,
        status,
      } = req.body;

      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.category = category || product.category;
      product.condition = condition || product.condition;
      product.type = type || product.type;
      product.images = images || product.images;
      product.location = location || product.location;
      product.status = status || product.status;

      // Handle rentPricePerDay conditionally
      if (type === 'rent' || product.type === 'rent') {
        product.rentPricePerDay = rentPricePerDay !== undefined ? rentPricePerDay : product.rentPricePerDay;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.owner.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this product');
      }

      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

export default router;
