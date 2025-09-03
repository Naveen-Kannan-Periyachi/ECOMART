import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      res.status(400);
      throw new Error('Please provide all required fields: name, email, password, and phone');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      // Check if it's the admin email
      if (email === 'admin@ecomart.com') {
        throw new Error('This is the admin email. Please use a different email for user registration or login as admin.');
      } else {
        throw new Error('User already exists with this email. Please use a different email or try logging in.');
      }
    }

    try {
      const user = await User.create({
        name,
        email,
        password,
        phone,
        address,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error('Failed to create user account. Please check your information and try again.');
      }
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        res.status(400);
        throw new Error('An account with this email already exists. Please use a different email.');
      }
      throw error;
    }
  })
);

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Check if MongoDB is connected
    const dbState = mongoose.connection.readyState;
    if (dbState !== 1) {
      const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      console.error(`Database connection state: ${states[dbState]}`);
      res.status(503);
      throw new Error('Database service unavailable. Please try again later.');
    }

    try {
      // Find user and select password field for comparison
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
      }

      // Generate token and send response
      const token = generateToken(user._id);
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: token
      });
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Handle specific error types
      if (error.name === 'ValidationError') {
        res.status(400);
        throw new Error('Invalid input data');
      } else if (error.name === 'MongoError') {
        res.status(503);
        throw new Error('Database error occurred');
      } else {
        res.status(error.status || 500);
        throw error;
      }
    }
  })
);

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get(
  '/profile',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  })
);

export default router;
