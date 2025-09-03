
import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';
import NotificationService from '../services/notificationService.js';

const router = express.Router();

// Get logged in user's orders (must be before /:id route)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('products')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create order (Buy Now)
router.post('/', protect, async (req, res) => {
  try {
    const { products } = req.body; // array of product IDs
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }
    let total = 0;
    const productDetails = [];
    for (const productId of products) {
      const product = await Product.findById(productId).populate('owner', 'name');
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }
      if (product.status !== 'available') {
        return res.status(400).json({ message: `Product ${productId} is not available` });
      }
      total += product.price;
      productDetails.push(product);
    }
    const order = await Order.create({
      buyer: req.user._id,
      products,
      total,
      status: 'pending',
    });

    // Create notifications for sellers
    try {
      const notificationService = new NotificationService(req.app.get('io'));
      
      // Group products by seller to avoid duplicate notifications
      const sellerProducts = {};
      productDetails.forEach(product => {
        const sellerId = product.owner._id.toString();
        if (!sellerProducts[sellerId]) {
          sellerProducts[sellerId] = { seller: product.owner, products: [] };
        }
        sellerProducts[sellerId].products.push(product);
      });

      // Send notification to each seller
      for (const [sellerId, { seller, products }] of Object.entries(sellerProducts)) {
        const productTitles = products.map(p => p.title).join(', ');
        await notificationService.createNotification({
          userId: sellerId,
          type: 'NEW_ORDER',
          title: 'New Order Received',
          message: `${req.user.name} placed an order for: ${productTitles}`,
          data: {
            orderId: order._id,
            buyerId: req.user._id,
            buyerName: req.user.name,
            products: products.map(p => ({ id: p._id, title: p.title, price: p.price })),
            total: products.reduce((sum, p) => sum + p.price, 0)
          },
          priority: 'HIGH',
          actionUrl: `/orders/${order._id}`
        });
      }

      // Create confirmation notification for buyer
      await notificationService.createNotification({
        userId: req.user._id,
        type: 'ORDER_CONFIRMATION',
        title: 'Order Created',
        message: `Your order for ${productDetails.length} item(s) has been created successfully.`,
        data: {
          orderId: order._id,
          total: total,
          itemCount: productDetails.length
        },
        priority: 'MEDIUM',
        actionUrl: `/orders/${order._id}`
      });
    } catch (notificationError) {
      console.error('Failed to create order notifications:', notificationError);
      // Don't fail the order creation if notification fails
    }

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
    const order = await Order.findById(req.params.id).populate('products');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    order.status = 'confirmed';
    await order.save();
    
    // Mark products as sold and notify sellers
    try {
      const notificationService = new NotificationService(req.app.get('io'));
      const sellerNotifications = {};
      
      for (const product of order.products) {
        await Product.findByIdAndUpdate(product._id, { status: 'sold' });
        
        // Group notifications by seller
        const sellerId = product.owner.toString();
        if (!sellerNotifications[sellerId]) {
          sellerNotifications[sellerId] = [];
        }
        sellerNotifications[sellerId].push(product);
      }

      // Send notifications to sellers
      for (const [sellerId, products] of Object.entries(sellerNotifications)) {
        const productTitles = products.map(p => p.title).join(', ');
        await notificationService.createNotification({
          userId: sellerId,
          type: 'ORDER_CONFIRMED',
          title: 'Order Confirmed',
          message: `Your product(s) have been sold: ${productTitles}`,
          data: {
            orderId: order._id,
            buyerId: req.user._id,
            buyerName: req.user.name,
            products: products.map(p => ({ id: p._id, title: p.title, price: p.price }))
          },
          priority: 'HIGH',
          actionUrl: `/orders/${order._id}`
        });
      }

      // Send confirmation to buyer
      await notificationService.createNotification({
        userId: req.user._id,
        type: 'ORDER_CONFIRMED',
        title: 'Order Confirmed',
        message: `Your order has been confirmed and payment processed successfully.`,
        data: {
          orderId: order._id,
          total: order.total,
          itemCount: order.products.length
        },
        priority: 'HIGH',
        actionUrl: `/orders/${order._id}`
      });
    } catch (notificationError) {
      console.error('Failed to create order confirmation notifications:', notificationError);
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


export default router;
