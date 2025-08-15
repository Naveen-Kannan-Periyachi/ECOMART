
import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


// Create order (Buy Now)
router.post('/', protect, async (req, res) => {
  try {
    const { products } = req.body; // array of product IDs
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }
    let total = 0;
    for (const productId of products) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }
      if (product.status !== 'available') {
        return res.status(400).json({ message: `Product ${productId} is not available` });
      }
      total += product.price;
    }
    const order = await Order.create({
      buyer: req.user._id,
      products,
      total,
      status: 'pending',
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('products');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.buyer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Confirm order (no payment gateway)
router.put('/:id/confirm', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    order.status = 'confirmed';
    await order.save();
    // Mark products as sold
    for (const productId of order.products) {
      await Product.findByIdAndUpdate(productId, { status: 'sold' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get logged in user's orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('products')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


export default router;
