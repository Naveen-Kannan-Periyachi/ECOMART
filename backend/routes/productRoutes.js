import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      price,
      rentPricePerDay,
      category,
      condition,
      type,
      images,
      location,
    } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      rentPricePerDay,
      category,
      condition,
      type,
      images,
      location,
      owner: req.user._id,
    });

    if (product) {
      res.status(201).json(product);
    } else {
      res.status(400);
      throw new Error('Invalid product data');
    }
  })
);

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      category,
      type,
      condition,
      minPrice,
      maxPrice,
      location,
      search,
    } = req.query;

    let query = {};

    if (category) query.category = category;
    if (type) query.type = type;
    if (condition) query.condition = condition;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(products);
  })
);

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );

    if (product) {
      // Increment views
      product.views = (product.views || 0) + 1;
      await product.save();
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.owner.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this product');
      }

      product.title = req.body.title || product.title;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.rentPricePerDay = req.body.rentPricePerDay || product.rentPricePerDay;
      product.category = req.body.category || product.category;
      product.condition = req.body.condition || product.condition;
      product.type = req.body.type || product.type;
      product.images = req.body.images || product.images;
      product.location = req.body.location || product.location;
      product.status = req.body.status || product.status;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.owner.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this product');
      }

      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

export default router;
