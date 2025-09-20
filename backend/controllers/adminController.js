import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/Order.js';
import { Chat, Message } from '../models/chatModel.js';

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

// @desc    Get single user details with products, orders, and chats
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Get user basic info
  const user = await User.findById(userId).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get products created by this user
  const products = await Product.find({ owner: userId })
    .select('title description price type category condition status createdAt')
    .sort({ createdAt: -1 });

  // Get orders made by this user
  const orders = await Order.find({ buyer: userId })
    .populate('products', 'title price')
    .select('products total status createdAt')
    .sort({ createdAt: -1 });

  // Get chats where user is either buyer or seller
  const chats = await Chat.find({
    $or: [
      { buyerId: userId },
      { sellerId: userId }
    ]
  })
  .populate('productId', 'title')
  .populate('buyerId', 'name email')
  .populate('sellerId', 'name email')
  .sort({ updatedAt: -1 });

  // Get recent messages for each chat
  const chatDetails = await Promise.all(
    chats.map(async (chat) => {
      const recentMessage = await Message.findOne({ chatId: chat._id })
        .sort({ createdAt: -1 })
        .populate('senderId', 'name');
      
      const messageCount = await Message.countDocuments({ chatId: chat._id });
      
      return {
        _id: chat._id,
        product: chat.productId,
        buyer: chat.buyerId,
        seller: chat.sellerId,
        messageCount,
        lastMessage: recentMessage ? {
          content: recentMessage.content,
          sender: recentMessage.senderId,
          createdAt: recentMessage.createdAt
        } : null,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      };
    })
  );

  // Calculate summary statistics
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalChats: chats.length,
    activeProducts: products.filter(p => p.status === 'available').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0)
  };

  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      products,
      orders,
      chats: chatDetails,
      stats
    }
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

// @desc    Delete user's product (from user details page)
// @route   DELETE /api/admin/users/:userId/products/:productId
// @access  Private/Admin
export const deleteUserProduct = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  const product = await Product.findOne({ _id: productId, owner: userId });
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found or does not belong to this user');
  }

  await product.deleteOne();
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Delete user's order (from user details page)
// @route   DELETE /api/admin/users/:userId/orders/:orderId
// @access  Private/Admin
export const deleteUserOrder = asyncHandler(async (req, res) => {
  const { userId, orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, buyer: userId });
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found or does not belong to this user');
  }

  await order.deleteOne();
  
  res.json({
    success: true,
    message: 'Order deleted successfully'
  });
});

// @desc    Delete user's chat (from user details page)
// @route   DELETE /api/admin/users/:userId/chats/:chatId
// @access  Private/Admin
export const deleteUserChat = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.params;

  const chat = await Chat.findOne({ 
    _id: chatId, 
    $or: [
      { buyerId: userId },
      { sellerId: userId }
    ]
  });
  
  if (!chat) {
    res.status(404);
    throw new Error('Chat not found or user is not a participant');
  }

  // Delete all messages in this chat
  await Message.deleteMany({ chatId: chatId });
  
  // Delete the chat
  await chat.deleteOne();
  
  res.json({
    success: true,
    message: 'Chat and all messages deleted successfully'
  });
});
