import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin, preventAdminDeletion } from '../middleware/adminMiddleware.js';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  updateOrderStatus
} from '../controllers/adminController.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(protect);
router.use(isAdmin);

// User management routes
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', preventAdminDeletion, deleteUser);

// Product management routes
router.get('/products', getAllProducts);
router.delete('/products/:id', deleteProduct);

// Order management routes
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
