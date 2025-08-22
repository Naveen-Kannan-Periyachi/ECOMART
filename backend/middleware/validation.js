import { body, param, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Product validation rules
export const validateProduct = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  
  body('rentPricePerDay')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Rent price per day must be greater than 0'),
  
  body('category')
    .isIn(['Electronics', 'Furniture', 'Fashion', 'Books', 'Sports', 'Others'])
    .withMessage('Invalid category'),
  
  body('condition')
    .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
    .withMessage('Invalid condition'),
  
  body('type')
    .isIn(['sell', 'rent', 'buy'])
    .withMessage('Invalid type'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  handleValidationErrors
];

// User registration validation
export const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  
  handleValidationErrors
];

// Order validation
export const validateOrder = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  
  body('total')
    .isFloat({ min: 0.01 })
    .withMessage('Total must be greater than 0'),
  
  handleValidationErrors
];

// Chat validation
export const validateChatMessage = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  
  handleValidationErrors
];

// ID parameter validation
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

export const validateChatId = [
  param('chatId')
    .isMongoId()
    .withMessage('Invalid chat ID format'),
  
  handleValidationErrors
];
