import express from 'express';
const router = express.Router();
import Booking from '../models/Booking.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';
// Note: Stripe integration removed for simplicity - can be re-added later

// Create booking request
router.post('/', protect, async (req, res) => {
  try {
    const { productId, startDate, endDate } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.type !== 'rent') {
      return res.status(400).json({ message: 'Product is not available for rent' });
    }
    if (product.status !== 'available') {
      return res.status(400).json({ message: 'Product is not available' });
    }

    // Check for date conflicts
    const conflictingBooking = await Booking.findOne({
      product: productId,
      status: { $in: ['requested', 'confirmed'] },
      $or: [
        {
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(startDate) }
        },
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(endDate) }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Product is not available for these dates' });
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * product.rentPricePerDay;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' }
    });

    // Create booking
    const booking = await Booking.create({
      product: productId,
      renter: req.user._id,
      owner: product.owner,
      startDate,
      endDate,
      totalPrice,
      paymentIntent: paymentIntent.id
    });

    res.status(201).json({
      booking,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's bookings
router.get('/mybookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id })
      .populate('product')
      .populate('owner', 'name email')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get owner's bookings
router.get('/owner', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('product')
      .populate('renter', 'name email')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Confirm booking
router.put('/:id/confirm', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the owner
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'confirmed';
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the renter or owner
    if (booking.renter.toString() !== req.user._id.toString() &&
        booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow cancellation of requested or confirmed bookings
    if (!['requested', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    // If payment was made, process refund
    if (booking.paymentStatus === 'paid') {
      const refund = await stripe.refunds.create({
        payment_intent: booking.paymentIntent
      });
      booking.paymentStatus = 'refunded';
    }

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Complete booking payment
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    booking.paymentStatus = 'paid';
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
