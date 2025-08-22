
import express from 'express';
import asyncHandler from 'express-async-handler';
import { Chat, Message } from '../models/chatModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
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

// Get chat info with populated data
router.get('/:chatId/info', protect, asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId)
    .populate('buyerId', 'name email')
    .populate('sellerId', 'name email')
    .populate('productId', 'title price images');

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  // Check if user is part of this chat
  if (chat.buyerId._id.toString() !== req.user._id.toString() && 
      chat.sellerId._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Structure the response
  const chatInfo = {
    _id: chat._id,
    buyerId: chat.buyerId._id,
    sellerId: chat.sellerId._id,
    productId: chat.productId._id,
    buyer: {
      _id: chat.buyerId._id,
      name: chat.buyerId.name,
      email: chat.buyerId.email
    },
    seller: {
      _id: chat.sellerId._id,
      name: chat.sellerId.name,
      email: chat.sellerId.email
    },
    product: {
      _id: chat.productId._id,
      title: chat.productId.title,
      price: chat.productId.price,
      images: chat.productId.images
    },
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt
  };

  res.json(chatInfo);
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
  // Get messages from Message model
  const messages = await Message.find({ chatId: req.params.chatId })
    .populate('senderId', 'name')
    .sort('createdAt');

  // Format messages for frontend
  const formattedMessages = messages.map(message => ({
    _id: message._id,
    content: message.content,
    senderId: message.senderId._id,
    senderName: message.senderId.name,
    createdAt: message.createdAt
  }));

  res.json(formattedMessages);
}));

// Send a message
router.post('/:chatId/message', protect, canAccessChat, asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Message content required' });
  }
  
  const senderId = req.user._id;
  const receiverId = req.chat.buyerId.toString() === senderId.toString()
    ? req.chat.sellerId
    : req.chat.buyerId;
  
  // Create message in Message collection
  const msg = await Message.create({
    chatId: req.params.chatId,
    senderId,
    receiverId,
    content: content.trim()
  });

  // Populate sender info
  await msg.populate('senderId', 'name');

  // Format message for response
  const formattedMessage = {
    _id: msg._id,
    content: msg.content,
    senderId: msg.senderId._id,
    senderName: msg.senderId.name,
    createdAt: msg.createdAt
  };

  // Update chat's updatedAt timestamp
  await Chat.findByIdAndUpdate(req.params.chatId, { updatedAt: new Date() });

  // Socket.io broadcast (if available)
  if (req.app.get('io')) {
    req.app.get('io').to(`chat_${req.params.chatId}`).emit('message', formattedMessage);
  }
  
  res.status(201).json(formattedMessage);
}));

// Get user's chat list
router.get('/', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const chats = await Chat.find({
    $or: [
      { buyerId: userId },
      { sellerId: userId }
    ]
  })
    .populate('buyerId', 'name email')
    .populate('sellerId', 'name email')
    .populate('productId', 'title price images')
    .sort({ updatedAt: -1 });

  // Get last message for each chat
  const formattedChats = await Promise.all(chats.map(async (chat) => {
    const otherUser = chat.buyerId._id.toString() === userId.toString() 
      ? chat.sellerId 
      : chat.buyerId;
    
    const lastMessage = await Message.findOne({ chatId: chat._id })
      .sort({ createdAt: -1 });

    return {
      _id: chat._id,
      product: {
        _id: chat.productId._id,
        title: chat.productId.title,
        price: chat.productId.price,
        image: chat.productId.images?.[0] || null
      },
      otherUser: {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email
      },
      lastMessage: lastMessage ? {
        content: lastMessage.content,
        createdAt: lastMessage.createdAt
      } : null,
      updatedAt: chat.updatedAt
    };
  }));

  res.json(formattedChats);
}));

export default router;
