import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();



// Get user profile
router.get('/profile', protect, getUserProfile);

// Update user profile (with avatar upload)
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);

export default router;
