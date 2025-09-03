import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  logActivity,
  getRecommendations,
  getTrendingProductsRoute,
  getUserActivity
} from '../controllers/recommendationController.js';

const router = express.Router();

// Activity logging routes
router.post('/activity', protect, logActivity);
router.get('/activity/user/:userId?', protect, getUserActivity);

// Recommendation routes
router.get('/products/recommend/:userId?', protect, getRecommendations);
router.get('/products/trending', getTrendingProductsRoute);

export default router;
