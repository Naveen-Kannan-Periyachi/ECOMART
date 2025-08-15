import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
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
    const products = await Product.find({ owner: req.user._id });

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
      },
      products,
      summary,
    });
  })
);

export default router;
