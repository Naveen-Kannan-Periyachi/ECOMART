import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if authorization header exists and has correct format
  if (!req.headers.authorization) {
    res.status(401);
    throw new Error('No authorization header found');
  }

  if (!req.headers.authorization.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Authorization header must start with "Bearer "');
  }

  try {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(401);
      throw new Error('Token not provided in Authorization header');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      res.status(401);
      throw new Error('Invalid token structure');
    }

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', {
      message: error.message,
      token: token ? `${token.substring(0, 10)}...` : 'No token',
      error: error.name
    });

    res.status(401);
    
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token format or signature');
    } else if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else {
      throw new Error(error.message || 'Authentication failed');
    }
  }
});
