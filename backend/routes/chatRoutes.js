
import express from 'express';
import asyncHandler from 'express-async-handler';
import { Chat, Message } from '../models/chatModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { protect } from '../middleware/authMiddleware.js';
import NotificationService from '../services/notificationService.js';

const router = express.Router();

// Start chat (or get existing)
router.post('/start', protect, asyncHandler(async (req, res) => {
  const { productId } = req.body;
<<<<<<< HEAD
  
  // Validate input
  if (!productId) {
    return res.status(400).json({ 
      success: false,
      message: 'Product ID required' 
    });
  }
  
  if (!req.user || !req.user._id) {
    return res.status(401).json({ 
      success: false,
      message: 'User authentication required' 
    });
  }
  
  console.log('Starting chat:', { productId, userId: req.user._id });
  
  try {
    // Find and validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    const sellerId = product.owner;
    const buyerId = req.user._id;
    
    // Validate IDs are not null
    if (!sellerId || !buyerId) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user or product data' 
      });
    }
    
    // Check if user is trying to chat with themselves
    if (sellerId.toString() === buyerId.toString()) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot start chat with yourself' 
      });
    }
    
    // Always try to find existing chat first
    let chat = await Chat.findOne({ 
      productId: productId, 
      buyerId: buyerId, 
      sellerId: sellerId 
    });
    
    if (!chat) {
      console.log('Creating new chat for:', { productId, buyerId, sellerId });
      
      // Create new chat with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries && !chat) {
        try {
          chat = await Chat.create({ 
            productId: productId, 
            buyerId: buyerId, 
            sellerId: sellerId 
          });
          console.log('Chat created successfully:', chat._id);
          break;
        } catch (createError) {
          if (createError.code === 11000) {
            // Duplicate key error, try to find existing chat
            console.log('Duplicate detected, searching for existing chat...');
            chat = await Chat.findOne({ 
              productId: productId, 
              buyerId: buyerId, 
              sellerId: sellerId 
            });
            if (chat) {
              console.log('Found existing chat after duplicate error:', chat._id);
              break;
            }
          }
          
          retryCount++;
          if (retryCount >= maxRetries) {
            throw createError;
          }
          
          // Wait a bit before retry
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } else {
      console.log('Existing chat found:', chat._id);
    }
    
    if (!chat) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to create or find chat' 
      });
    }
    
    res.json({
      success: true,
      data: chat,
      _id: chat._id,
      productId: chat.productId,
      buyerId: chat.buyerId,
      sellerId: chat.sellerId,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    });
    
  } catch (error) {
    console.error('Error in chat start:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'Failed to start chat', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

// Get chat info with populated data
router.get('/:chatId/info', protect, asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId)
    .populate('buyerId', 'name email')
    .populate('sellerId', 'name email')
    .populate('productId', 'title price images');

=======
  if (!productId) return res.status(400).json({ message: 'Product ID required' });
  
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  const sellerId = product.owner;
  const buyerId = req.user._id;
  
  if (sellerId.toString() === buyerId.toString()) {
    return res.status(400).json({ message: 'Cannot start chat with yourself' });
  }
  
  let chat = await Chat.findOne({ productId, buyerId, sellerId });
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }
<<<<<<< HEAD

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
=======
  
  res.json(chat);
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
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

<<<<<<< HEAD
  // Get product info for notification
  const product = await Product.findById(req.chat.productId);
  
  // Create notification for message recipient
  try {
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.createNotification({
      userId: receiverId,
      type: 'NEW_MESSAGE',
      title: 'New Message',
      message: `${req.user.name} sent you a message about "${product?.title || 'product'}"`,
      data: {
        chatId: req.params.chatId,
        productId: req.chat.productId,
        senderId: senderId,
        senderName: req.user.name,
        messagePreview: content.trim().substring(0, 50) + (content.trim().length > 50 ? '...' : '')
      },
      priority: 'MEDIUM',
      actionUrl: `/chat/${req.params.chatId}`
    });
  } catch (notificationError) {
    console.error('Failed to create message notification:', notificationError);
    // Don't fail the message sending if notification fails
  }

=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
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
