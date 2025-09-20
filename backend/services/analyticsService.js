import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

// User Analytics
export const getUserAnalytics = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const usersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });
    
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    return {
      totalUsers,
      usersThisMonth,
      usersByRole,
      userGrowth
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
};

// Product Analytics
export const getProductAnalytics = async () => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isAvailable: true });
    const productsThisMonth = await Product.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const productsByType = await Product.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const averagePrice = await Product.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);

    const priceRanges = await Product.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 50, 100, 500, 1000, 5000],
          default: '5000+',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    const topRatedProducts = await Product.find()
      .sort({ averageRating: -1 })
      .limit(10)
      .select('title averageRating reviewCount');

    return {
      totalProducts,
      activeProducts,
      productsThisMonth,
      productsByCategory,
      productsByType,
      averagePrice: averagePrice[0]?.avgPrice || 0,
      priceRanges,
      topRatedProducts
    };
  } catch (error) {
    console.error('Error getting product analytics:', error);
    throw error;
  }
};

// Sales Analytics
export const getSalesAnalytics = async () => {
  try {
    const totalOrders = await Order.countDocuments();
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    const totalRevenue = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const revenueThisMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setDate(1)) },
          status: { $nin: ['cancelled', 'refunded'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: { status: { $nin: ['cancelled', 'refunded'] } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    const averageOrderValue = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, avgValue: { $avg: '$total' } } }
    ]);

    const topBuyers = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      {
        $group: {
          _id: '$buyer',
          totalSpent: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ['$userDetails.name', 0] },
          email: { $arrayElemAt: ['$userDetails.email', 0] },
          totalSpent: 1,
          orderCount: 1
        }
      }
    ]);

    return {
      totalOrders,
      ordersThisMonth,
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueThisMonth: revenueThisMonth[0]?.total || 0,
      ordersByStatus,
      monthlyRevenue,
      averageOrderValue: averageOrderValue[0]?.avgValue || 0,
      topBuyers
    };
  } catch (error) {
    console.error('Error getting sales analytics:', error);
    throw error;
  }
};

// Activity Analytics
export const getActivityAnalytics = async () => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({
      status: 'confirmed',
      endDate: { $gte: new Date() }
    });

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const bookingsThisMonth = await Booking.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    const totalBookingRevenue = await Booking.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const popularRentalCategories = await Booking.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return {
      totalBookings,
      activeBookings,
      bookingsByStatus,
      bookingsThisMonth,
      totalBookingRevenue: totalBookingRevenue[0]?.total || 0,
      popularRentalCategories
    };
  } catch (error) {
    console.error('Error getting activity analytics:', error);
    throw error;
  }
};

// Dashboard Overview
export const getDashboardOverview = async () => {
  try {
    const [userAnalytics, productAnalytics, salesAnalytics, activityAnalytics] = await Promise.all([
      getUserAnalytics(),
      getProductAnalytics(),
      getSalesAnalytics(),
      getActivityAnalytics()
    ]);

    // Calculate growth percentages
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [lastMonthUsers, lastMonthOrders, lastMonthRevenue] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: lastMonth, $lt: thisMonth }
      }),
      Order.countDocuments({
        createdAt: { $gte: lastMonth, $lt: thisMonth }
      }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonth, $lt: thisMonth },
            status: { $nin: ['cancelled', 'refunded'] }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const userGrowth = lastMonthUsers ? 
      ((userAnalytics.usersThisMonth - lastMonthUsers) / lastMonthUsers * 100).toFixed(1) : 0;
    const orderGrowth = lastMonthOrders ? 
      ((salesAnalytics.ordersThisMonth - lastMonthOrders) / lastMonthOrders * 100).toFixed(1) : 0;
    const revenueGrowth = lastMonthRevenue[0]?.total ? 
      ((salesAnalytics.revenueThisMonth - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100).toFixed(1) : 0;

    return {
      overview: {
        totalUsers: userAnalytics.totalUsers,
        newUsersThisMonth: userAnalytics.usersThisMonth,
        userGrowth: parseFloat(userGrowth),
        
        totalProducts: productAnalytics.totalProducts,
        activeProducts: productAnalytics.activeProducts,
        productsThisMonth: productAnalytics.productsThisMonth,
        
        totalOrders: salesAnalytics.totalOrders,
        ordersThisMonth: salesAnalytics.ordersThisMonth,
        orderGrowth: parseFloat(orderGrowth),
        
        totalRevenue: salesAnalytics.totalRevenue,
        revenueThisMonth: salesAnalytics.revenueThisMonth,
        revenueGrowth: parseFloat(revenueGrowth),
        
        totalBookings: activityAnalytics.totalBookings,
        activeBookings: activityAnalytics.activeBookings,
        bookingsThisMonth: activityAnalytics.bookingsThisMonth
      },
      charts: {
        userGrowth: userAnalytics.userGrowth,
        monthlyRevenue: salesAnalytics.monthlyRevenue,
        productsByCategory: productAnalytics.productsByCategory,
        ordersByStatus: salesAnalytics.ordersByStatus
      }
    };
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    throw error;
  }
};

// Real-time metrics (for live dashboard updates)
export const getRealTimeMetrics = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayUsers, todayOrders, todayRevenue, onlineUsers] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: today },
            status: { $nin: ['cancelled', 'refunded'] }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 15 * 60 * 1000) } }) // Active in last 15 minutes
    ]);

    return {
      todayUsers,
      todayOrders,
      todayRevenue: todayRevenue[0]?.total || 0,
      onlineUsers,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error getting real-time metrics:', error);
    throw error;
  }
};