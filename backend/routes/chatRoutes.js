
import express from 'express';
import asyncHandler from 'express-async-handler';
import { Chat, Message } from '../models/chatModel.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Start chat (or get existing)
router.post('/start', protect, asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID required' });
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const sellerId = product.owner;
  const buyerId = req.user._id;
  if (sellerId.toString() === buyerId.toString()) {
    return res.status(400).json({ message: 'Cannot start chat with yourself' });
  }
  let chat = await Chat.findOne({ productId, buyerId, sellerId });
  if (!chat) {
    chat = await Chat.create({ productId, buyerId, sellerId });
  }
  res.json(chat);
}));

// Middleware: Only buyer or seller can access chat
const canAccessChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  if (
    chat.buyerId.toString() !== req.user._id.toString() &&
    chat.sellerId.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  req.chat = chat;
  next();
});

// Get messages for a chat
router.get('/:chatId', protect, canAccessChat, asyncHandler(async (req, res) => {
  const messages = await Message.find({ chatId: req.params.chatId }).sort('createdAt');
  res.json(messages);
}));

// Send a message
router.post('/:chatId/message', protect, canAccessChat, asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Message content required' });
  const senderId = req.user._id;
  const receiverId = req.chat.buyerId.toString() === senderId.toString()
    ? req.chat.sellerId
    : req.chat.buyerId;
  const msg = await Message.create({
    chatId: req.params.chatId,
    senderId,
    receiverId,
    content
  });
  // Socket.io broadcast (if available)
  if (req.app.get('io')) {
    req.app.get('io').to(`room_${req.params.chatId}`).emit('message', msg);
  }
  res.status(201).json(msg);
}));

export default router;
