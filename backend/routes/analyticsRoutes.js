import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserAnalytics,
  getProductAnalytics,
  getSalesAnalytics,
  getActivityAnalytics,
  getDashboardOverview,
  getRealTimeMetrics
} from '../services/analyticsService.js';

const router = express.Router();

// Middleware to protect all analytics routes
router.use(protect);

// @desc    Get dashboard overview with all key metrics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin/Seller)
router.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    // Check if user is admin or seller
    if (req.user.role !== 'admin' && req.user.role !== 'seller') {
      res.status(403);
      throw new Error('Access denied. Admin or seller privileges required.');
    }

    const dashboardData = await getDashboardOverview();
    
    res.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard analytics retrieved successfully'
    });
  })
);

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private (Admin only)
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Access denied. Admin privileges required.');
    }

    const userAnalytics = await getUserAnalytics();
    
    res.json({
      success: true,
      data: userAnalytics,
      message: 'User analytics retrieved successfully'
    });
  })
);

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private (Admin/Seller)
router.get(
  '/products',
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'seller') {
      res.status(403);
      throw new Error('Access denied. Admin or seller privileges required.');
    }

    const productAnalytics = await getProductAnalytics();
    
    res.json({
      success: true,
      data: productAnalytics,
      message: 'Product analytics retrieved successfully'
    });
  })
);

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private (Admin/Seller)
router.get(
  '/sales',
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'seller') {
      res.status(403);
      throw new Error('Access denied. Admin or seller privileges required.');
    }

    const salesAnalytics = await getSalesAnalytics();
    
    res.json({
      success: true,
      data: salesAnalytics,
      message: 'Sales analytics retrieved successfully'
    });
  })
);

// @desc    Get activity/booking analytics
// @route   GET /api/analytics/activity
// @access  Private (Admin/Seller)
router.get(
  '/activity',
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'seller') {
      res.status(403);
      throw new Error('Access denied. Admin or seller privileges required.');
    }

    const activityAnalytics = await getActivityAnalytics();
    
    res.json({
      success: true,
      data: activityAnalytics,
      message: 'Activity analytics retrieved successfully'
    });
  })
);

// @desc    Get real-time metrics
// @route   GET /api/analytics/realtime
// @access  Private (Admin/Seller)
router.get(
  '/realtime',
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'seller') {
      res.status(403);
      throw new Error('Access denied. Admin or seller privileges required.');
    }

    const realTimeMetrics = await getRealTimeMetrics();
    
    res.json({
      success: true,
      data: realTimeMetrics,
      message: 'Real-time metrics retrieved successfully'
    });
  })
);

// @desc    Get personal seller analytics (for individual sellers)
// @route   GET /api/analytics/my-analytics
// @access  Private (Seller)
router.get(
  '/my-analytics',
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'seller') {
      res.status(403);
      throw new Error('Access denied. Seller privileges required.');
    }

    // Get analytics specific to this seller
    const Product = (await import('../models/productModel.js')).default;
    const Order = (await import('../models/Order.js')).default;
    const Booking = (await import('../models/Booking.js')).default;

    const sellerId = req.user._id;

    const [products, orders, bookings] = await Promise.all([
      Product.find({ seller: sellerId }),
      Order.find({ seller: sellerId }).populate('buyer', 'name email'),
      Booking.find({ seller: sellerId }).populate('renter', 'name email')
    ]);

    const analytics = {
      products: {
        total: products.length,
        active: products.filter(p => p.isAvailable).length,
        byCategory: products.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {}),
        totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
        averageRating: products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length || 0
      },
      orders: {
        total: orders.length,
        revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
        byStatus: orders.reduce((acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {})
      },
      bookings: {
        total: bookings.length,
        revenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
        byStatus: bookings.reduce((acc, b) => {
          acc[b.status] = (acc[b.status] || 0) + 1;
          return acc;
        }, {})
      }
    };

    res.json({
      success: true,
      data: analytics,
      message: 'Personal analytics retrieved successfully'
    });
  })
);

export default router;