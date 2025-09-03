import express from 'express';
import asyncHandler from 'express-async-handler';
import Negotiation from '../models/negotiationModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { protect } from '../middleware/authMiddleware.js';
import NotificationService from '../services/notificationService.js';

const router = express.Router();

// Create a new negotiation (initial price offer)
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, proposedPrice, message } = req.body;

  if (!productId || !proposedPrice) {
    return res.status(400).json({ message: 'Product ID and proposed price are required' });
  }

  // Validate product exists and is available
  const product = await Product.findById(productId).populate('owner', 'name email');
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.status !== 'available') {
    return res.status(400).json({ message: 'Product is not available for negotiation' });
  }

  // Check if user is trying to negotiate on their own product
  if (product.owner._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot negotiate on your own product' });
  }

  // Check if there's already an active negotiation
  const existingNegotiation = await Negotiation.findOne({
    productId,
    buyerId: req.user._id,
    status: { $in: ['PENDING', 'COUNTER_OFFERED'] }
  });

  if (existingNegotiation) {
    return res.status(400).json({ message: 'You already have an active negotiation for this product' });
  }

  // Validate proposed price
  if (proposedPrice <= 0) {
    return res.status(400).json({ message: 'Proposed price must be greater than 0' });
  }

  if (proposedPrice >= product.price) {
    return res.status(400).json({ message: 'Proposed price should be less than the original price' });
  }

  // Create negotiation
  const negotiation = await Negotiation.create({
    productId,
    buyerId: req.user._id,
    sellerId: product.owner._id,
    originalPrice: product.price,
    proposedPrice,
    buyerMessage: message
  });

  // Populate the negotiation data
  await negotiation.populate([
    { path: 'buyerId', select: 'name email' },
    { path: 'sellerId', select: 'name email' },
    { path: 'productId', select: 'title price images' }
  ]);

  // Send notification to seller
  try {
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.createNotification({
      userId: product.owner._id,
      type: 'PRICE_NEGOTIATION',
      title: 'New Price Negotiation',
      message: `${req.user.name} wants to negotiate the price for "${product.title}" from $${product.price} to $${proposedPrice}`,
      data: {
        negotiationId: negotiation._id,
        productId: product._id,
        buyerId: req.user._id,
        buyerName: req.user.name,
        originalPrice: product.price,
        proposedPrice: proposedPrice
      },
      priority: 'MEDIUM',
      actionUrl: `/negotiations/${negotiation._id}`
    });
  } catch (notificationError) {
    console.error('Failed to create negotiation notification:', notificationError);
  }

  res.status(201).json({
    message: 'Negotiation started successfully',
    negotiation
  });
}));

// Get user's negotiations (as buyer or seller)
router.get('/', protect, asyncHandler(async (req, res) => {
  const { role = 'all', status = 'all', page = 1, limit = 10 } = req.query;
  
  let query = {};
  
  // Filter by role
  if (role === 'buyer') {
    query.buyerId = req.user._id;
  } else if (role === 'seller') {
    query.sellerId = req.user._id;
  } else {
    query.$or = [
      { buyerId: req.user._id },
      { sellerId: req.user._id }
    ];
  }

  // Filter by status
  if (status !== 'all') {
    query.status = status.toUpperCase();
  }

  const negotiations = await Negotiation.find(query)
    .populate('buyerId', 'name email')
    .populate('sellerId', 'name email')
    .populate('productId', 'title price images')
    .populate('counterOffers.offeredBy', 'name')
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Negotiation.countDocuments(query);

  res.json({
    negotiations,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalNegotiations: total,
      hasMore: page * limit < total
    }
  });
}));

// Get specific negotiation details
router.get('/:negotiationId', protect, asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findById(req.params.negotiationId)
    .populate('buyerId', 'name email')
    .populate('sellerId', 'name email')
    .populate('productId', 'title price images description')
    .populate('counterOffers.offeredBy', 'name');

  if (!negotiation) {
    return res.status(404).json({ message: 'Negotiation not found' });
  }

  // Check if user is involved in this negotiation
  if (
    negotiation.buyerId._id.toString() !== req.user._id.toString() &&
    negotiation.sellerId._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(negotiation);
}));

// Respond to negotiation (accept, reject, or counter-offer)
router.patch('/:negotiationId/respond', protect, asyncHandler(async (req, res) => {
  const { action, counterOffer, message } = req.body;
  
  if (!action || !['accept', 'reject', 'counter'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action. Must be accept, reject, or counter' });
  }

  const negotiation = await Negotiation.findById(req.params.negotiationId)
    .populate('buyerId', 'name email')
    .populate('sellerId', 'name email')
    .populate('productId', 'title price');

  if (!negotiation) {
    return res.status(404).json({ message: 'Negotiation not found' });
  }

  // Check if user is the seller or the last person who didn't make the offer
  const latestOffer = negotiation.getLatestOffer();
  const canRespond = (
    (req.user._id.toString() === negotiation.sellerId._id.toString()) ||
    (req.user._id.toString() === negotiation.buyerId._id.toString() && 
     latestOffer.offeredBy.toString() !== req.user._id.toString())
  );

  if (!canRespond) {
    return res.status(403).json({ message: 'You cannot respond to this negotiation' });
  }

  if (!negotiation.isActive()) {
    return res.status(400).json({ message: 'This negotiation is no longer active' });
  }

  const notificationService = new NotificationService(req.app.get('io'));
  let notificationData = {};

  switch (action) {
    case 'accept':
      negotiation.status = 'ACCEPTED';
      negotiation.finalPrice = latestOffer.amount;
      negotiation.acceptedAt = new Date();
      negotiation.sellerResponse = message;

      // Update product price if seller accepts
      if (req.user._id.toString() === negotiation.sellerId._id.toString()) {
        await Product.findByIdAndUpdate(negotiation.productId._id, {
          price: negotiation.finalPrice
        });
      }

      notificationData = {
        userId: req.user._id.toString() === negotiation.sellerId._id.toString() 
          ? negotiation.buyerId._id 
          : negotiation.sellerId._id,
        type: 'NEGOTIATION_ACCEPTED',
        title: 'Negotiation Accepted',
        message: `Your price negotiation for "${negotiation.productId.title}" has been accepted at $${negotiation.finalPrice}`,
        data: {
          negotiationId: negotiation._id,
          productId: negotiation.productId._id,
          finalPrice: negotiation.finalPrice
        },
        priority: 'HIGH',
        actionUrl: `/product/${negotiation.productId._id}`
      };
      break;

    case 'reject':
      negotiation.status = 'REJECTED';
      negotiation.rejectedAt = new Date();
      negotiation.sellerResponse = message;

      notificationData = {
        userId: req.user._id.toString() === negotiation.sellerId._id.toString() 
          ? negotiation.buyerId._id 
          : negotiation.sellerId._id,
        type: 'NEGOTIATION_REJECTED',
        title: 'Negotiation Rejected',
        message: `Your price negotiation for "${negotiation.productId.title}" has been rejected`,
        data: {
          negotiationId: negotiation._id,
          productId: negotiation.productId._id
        },
        priority: 'MEDIUM',
        actionUrl: `/product/${negotiation.productId._id}`
      };
      break;

    case 'counter':
      if (!counterOffer || counterOffer <= 0) {
        return res.status(400).json({ message: 'Valid counter offer amount is required' });
      }

      if (!negotiation.canCounterOffer()) {
        return res.status(400).json({ message: 'Maximum negotiation rounds reached' });
      }

      negotiation.status = 'COUNTER_OFFERED';
      negotiation.counterOffers.push({
        offeredBy: req.user._id,
        amount: counterOffer,
        message: message
      });
      negotiation.negotiationRound += 1;

      notificationData = {
        userId: req.user._id.toString() === negotiation.sellerId._id.toString() 
          ? negotiation.buyerId._id 
          : negotiation.sellerId._id,
        type: 'NEGOTIATION_COUNTER',
        title: 'Counter Offer Received',
        message: `New counter offer of $${counterOffer} for "${negotiation.productId.title}"`,
        data: {
          negotiationId: negotiation._id,
          productId: negotiation.productId._id,
          counterOffer: counterOffer,
          round: negotiation.negotiationRound
        },
        priority: 'MEDIUM',
        actionUrl: `/negotiations/${negotiation._id}`
      };
      break;
  }

  await negotiation.save();

  // Send notification
  try {
    await notificationService.createNotification(notificationData);
  } catch (notificationError) {
    console.error('Failed to create negotiation response notification:', notificationError);
  }

  // Populate updated negotiation
  await negotiation.populate('counterOffers.offeredBy', 'name');

  res.json({
    message: `Negotiation ${action}ed successfully`,
    negotiation
  });
}));

// Cancel negotiation (only by buyer who initiated)
router.delete('/:negotiationId', protect, asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findById(req.params.negotiationId);

  if (!negotiation) {
    return res.status(404).json({ message: 'Negotiation not found' });
  }

  // Only buyer who initiated can cancel
  if (negotiation.buyerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Only the buyer who initiated can cancel the negotiation' });
  }

  if (!negotiation.isActive()) {
    return res.status(400).json({ message: 'Cannot cancel a negotiation that is not active' });
  }

  negotiation.status = 'REJECTED';
  negotiation.rejectedAt = new Date();
  await negotiation.save();

  res.json({ message: 'Negotiation cancelled successfully' });
}));

// Get negotiation statistics for a product
router.get('/product/:productId/stats', protect, asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  // Verify product exists and user is the owner
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const stats = await Negotiation.aggregate([
    { $match: { productId: mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProposedPrice: { $avg: '$proposedPrice' },
        minProposedPrice: { $min: '$proposedPrice' },
        maxProposedPrice: { $max: '$proposedPrice' }
      }
    }
  ]);

  const totalNegotiations = await Negotiation.countDocuments({ productId });
  const activeNegotiations = await Negotiation.countDocuments({ 
    productId, 
    status: { $in: ['PENDING', 'COUNTER_OFFERED'] } 
  });

  res.json({
    totalNegotiations,
    activeNegotiations,
    statistics: stats
  });
}));

export default router;
