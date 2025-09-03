import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin, preventAdminDeletion } from '../middleware/adminMiddleware.js';
import {
  getAllUsers,
<<<<<<< HEAD
  getUserDetails,
=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
  updateUserRole,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllOrders,
<<<<<<< HEAD
  updateOrderStatus,
  deleteUserProduct,
  deleteUserOrder,
  deleteUserChat
=======
  updateOrderStatus
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
} from '../controllers/adminController.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(protect);
router.use(isAdmin);

// User management routes
router.get('/users', getAllUsers);
<<<<<<< HEAD
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', preventAdminDeletion, deleteUser);

// User-specific item management routes
router.delete('/users/:userId/products/:productId', deleteUserProduct);
router.delete('/users/:userId/orders/:orderId', deleteUserOrder);
router.delete('/users/:userId/chats/:chatId', deleteUserChat);

=======
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', preventAdminDeletion, deleteUser);

>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
// Product management routes
router.get('/products', getAllProducts);
router.delete('/products/:id', deleteProduct);

// Order management routes
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
