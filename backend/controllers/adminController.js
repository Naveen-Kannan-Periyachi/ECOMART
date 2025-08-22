import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/Order.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  if (!['user', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role. Must be either "user" or "admin"');
  }

  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent changing own role
  if (req.user._id.toString() === req.params.id) {
    res.status(403);
    throw new Error('Cannot change your own role');
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: `User role updated to ${role}`,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent deleting another admin (extra security)
  if (user.role === 'admin') {
    res.status(403);
    throw new Error('Cannot delete another admin account');
  }

  await user.deleteOne();
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });
    
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('buyer', 'name email')
    .populate('products', 'title price')
    .sort({ createdAt: -1 });
    
  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const validStatuses = ['pending', 'confirmed', 'shipped', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be one of: pending, confirmed, shipped, cancelled');
  }

  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  // Populate the updated order for response
  await order.populate('buyer', 'name email');
  await order.populate('products', 'title price');

  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    data: order
  });
});
