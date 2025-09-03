import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Activity from '../models/Activity.js';
import mongoose from 'mongoose';

// @desc    Log user activity
// @route   POST /api/activity
// @access  Private
export const logActivity = asyncHandler(async (req, res) => {
  const { productId, action, metadata = {} } = req.body;
  const userId = req.user._id;

  if (!productId || !action) {
    res.status(400);
    throw new Error('Product ID and action are required');
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Avoid duplicate activities within a short time frame (5 minutes)
  const recentActivity = await Activity.findOne({
    userId,
    productId,
    action,
    createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
  });

  if (!recentActivity) {
    await Activity.create({
      userId,
      productId,
      action,
      metadata
    });

    // If this is a "viewed" action, increment the product's view count
    if (action === 'viewed') {
      await Product.findByIdAndUpdate(productId, { 
        $inc: { views: 1 } 
      });
    }
  }

  res.status(201).json({
    success: true,
    message: 'Activity logged successfully'
  });
});

// @desc    Get product recommendations for a user
// @route   GET /api/products/recommend/:userId
// @access  Private
export const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  const limit = parseInt(req.query.limit) || 8;

  // Validate userId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid user ID is required'
    });
  }

  // Convert userId to ObjectId
  const userObjectId = new mongoose.Types.ObjectId(userId);

  try {
    // Get user's activity history
    const userActivities = await Activity.find({ userId: userObjectId })
      .populate('productId', 'category type')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50 activities

    // Extract categories and types from user's activity
    const userCategories = [...new Set(
      userActivities
        .filter(activity => activity.productId)
        .map(activity => activity.productId.category)
        .filter(Boolean)
    )];

    const userTypes = [...new Set(
      userActivities
        .filter(activity => activity.productId)
        .map(activity => activity.productId.type)
        .filter(Boolean)
    )];

    // Get products user has already interacted with
    const viewedProductIds = userActivities.map(activity => activity.productId?._id).filter(Boolean);

    let recommendations = [];

    // 1. Category-based recommendations (40% weight)
    if (userCategories.length > 0) {
      const categoryRecommendations = await Product.find({
        _id: { $nin: viewedProductIds },
        category: { $in: userCategories },
        isActive: true
      })
      .populate('owner', 'name email')
      .sort({ createdAt: -1, views: -1 })
      .limit(Math.ceil(limit * 0.4));

      recommendations = [...recommendations, ...categoryRecommendations];
    }

    // 2. Type-based recommendations (30% weight)
    if (userTypes.length > 0 && recommendations.length < limit) {
      const typeRecommendations = await Product.find({
        _id: { $nin: [...viewedProductIds, ...recommendations.map(p => p._id)] },
        type: { $in: userTypes },
        isActive: true
      })
      .populate('owner', 'name email')
      .sort({ createdAt: -1, views: -1 })
      .limit(Math.ceil(limit * 0.3));

      recommendations = [...recommendations, ...typeRecommendations];
    }

    // 3. Collaborative filtering - users with similar preferences (20% weight)
    if (recommendations.length < limit) {
      const similarUsers = await Activity.aggregate([
        {
          $match: {
            productId: { $in: viewedProductIds },
            userId: { $ne: userObjectId }
          }
        },
        {
          $group: {
            _id: '$userId',
            commonProducts: { $sum: 1 }
          }
        },
        {
          $sort: { commonProducts: -1 }
        },
        {
          $limit: 10
        }
      ]);

      if (similarUsers.length > 0) {
        const similarUserIds = similarUsers.map(user => user._id);
        
        const collaborativeRecommendations = await Activity.aggregate([
          {
            $match: {
              userId: { $in: similarUserIds },
              productId: { $nin: viewedProductIds },
              action: { $in: ['bought', 'rented', 'viewed'] }
            }
          },
          {
            $group: {
              _id: '$productId',
              score: { $sum: 1 }
            }
          },
          {
            $sort: { score: -1 }
          },
          {
            $limit: Math.ceil(limit * 0.2)
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
            $match: {
              'product.isActive': true
            }
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
            $replaceRoot: { newRoot: '$product' }
          }
        ]);

        recommendations = [...recommendations, ...collaborativeRecommendations];
      }
    }

    // 4. Trending/Popular products as fallback (remaining slots)
    if (recommendations.length < limit) {
      const trendingProducts = await getTrendingProducts(
        limit - recommendations.length,
        [...viewedProductIds, ...recommendations.map(p => p._id)]
      );
      recommendations = [...recommendations, ...trendingProducts];
    }

    // Remove duplicates and limit results
    const uniqueRecommendations = recommendations
      .filter((product, index, self) => 
        index === self.findIndex(p => p._id.toString() === product._id.toString())
      )
      .slice(0, limit);

    res.json({
      success: true,
      count: uniqueRecommendations.length,
      data: uniqueRecommendations,
      metadata: {
        userCategories,
        userTypes,
        totalActivities: userActivities.length,
        hasPersonalization: userActivities.length > 0
      }
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    
    // Fallback: return trending products
    const fallbackProducts = await getTrendingProducts(limit, viewedProductIds);
    
    res.json({
      success: true,
      count: fallbackProducts.length,
      data: fallbackProducts,
      metadata: {
        fallback: true,
        error: 'Personalization unavailable'
      }
    });
  }
});

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
export const getTrendingProducts = asyncHandler(async (limit = 10, excludeIds = []) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const trendingProducts = await Activity.aggregate([
    {
      $match: {
        action: { $in: ['viewed', 'bought', 'rented'] },
        createdAt: { $gte: thirtyDaysAgo },
        productId: { $nin: excludeIds }
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
      $match: {
        'product.isActive': true
      }
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
      _id: { $nin: [...excludeIds, ...trendingProducts.map(p => p._id)] },
      isActive: true
    })
    .populate('owner', 'name email')
    .sort({ createdAt: -1, views: -1 })
    .limit(limit - trendingProducts.length);

    return [...trendingProducts, ...recentProducts];
  }

  return trendingProducts;
});

// Export trending products as a route handler
export const getTrendingProductsRoute = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const trendingProducts = await getTrendingProducts(limit);

  res.json({
    success: true,
    count: trendingProducts.length,
    data: trendingProducts
  });
});

// @desc    Get user activity history
// @route   GET /api/activity/user/:userId
// @access  Private
export const getUserActivity = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const activities = await Activity.find({ userId })
      .populate('productId', 'title price images category type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalActivities = await Activity.countDocuments({ userId });

    res.json({
      success: true,
      count: activities.length,
      total: totalActivities,
      page,
      pages: Math.ceil(totalActivities / limit),
      data: activities
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});
