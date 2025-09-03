import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user dashboard data
// @route   GET /api/dashboard
// @access  Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    // Get user's products
    const products = await Product.find({ owner: req.user._id }).sort({ createdAt: -1 });

    // Get user's orders (as buyer)
    const orders = await Order.find({ buyer: req.user._id })
      .populate('products', 'title price')
      .sort({ createdAt: -1 });

    // Get user's bookings (as renter)
    const bookings = await Booking.find({ renter: req.user._id })
      .populate('product', 'title rentPricePerDay')
      .sort({ createdAt: -1 });

    // Calculate summary counts
    const summary = {
      total: products.length,
      byType: {
        sell: products.filter((p) => p.type === 'sell').length,
        rent: products.filter((p) => p.type === 'rent').length,
        buy: products.filter((p) => p.type === 'buy').length,
      },
      byCategory: {},
      byStatus: {
        available: products.filter((p) => p.status === 'available').length,
        sold: products.filter((p) => p.status === 'sold').length,
        rented: products.filter((p) => p.status === 'rented').length,
      },
      orders: {
        total: orders.length,
        byStatus: {
          pending: orders.filter((o) => o.status === 'pending').length,
          confirmed: orders.filter((o) => o.status === 'confirmed').length,
          shipped: orders.filter((o) => o.status === 'shipped').length,
          cancelled: orders.filter((o) => o.status === 'cancelled').length,
        }
      },
      bookings: {
        total: bookings.length,
        byStatus: {
          requested: bookings.filter((b) => b.status === 'requested').length,
          confirmed: bookings.filter((b) => b.status === 'confirmed').length,
          completed: bookings.filter((b) => b.status === 'completed').length,
          cancelled: bookings.filter((b) => b.status === 'cancelled').length,
        }
      }
    };

    // Calculate category counts
    products.forEach((product) => {
      if (summary.byCategory[product.category]) {
        summary.byCategory[product.category]++;
      } else {
        summary.byCategory[product.category] = 1;
      }
    });

    res.json({
      profile: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        role: req.user.role,
      },
      products,
      orders,
      bookings,
      summary,
    });
  })
);

export default router;
