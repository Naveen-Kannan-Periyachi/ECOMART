import express from 'express';
import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';
import NotificationService from '../services/notificationService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user notifications
router.get('/', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  
  try {
    const notificationService = new NotificationService(req.app.get('io'));
    const result = await notificationService.getUserNotifications(
      req.user._id,
      parseInt(page),
      parseInt(limit),
      unreadOnly === 'true'
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
}));

// Get unread notification count
router.get('/unread-count', protect, asyncHandler(async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
}));

// Mark notification as read
router.patch('/:notificationId/read', protect, asyncHandler(async (req, res) => {
  try {
    const notificationService = new NotificationService(req.app.get('io'));
    const notification = await notificationService.markAsRead(
      req.params.notificationId,
      req.user._id
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
}));

// Mark all notifications as read
router.patch('/mark-all-read', protect, asyncHandler(async (req, res) => {
  try {
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.markAllAsRead(req.user._id);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
}));

// Delete notification
router.delete('/:notificationId', protect, asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notificationId,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
}));

// Create test notification (for development only)
router.post('/test', protect, asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Test notifications disabled in production' });
  }

  try {
    const notificationService = new NotificationService(req.app.get('io'));
    const notification = await notificationService.createNotification({
      userId: req.user._id,
      type: 'SYSTEM_UPDATE',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working.',
      priority: 'LOW',
      actionUrl: '/dashboard'
    });

    res.status(201).json({ message: 'Test notification created', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error creating test notification', error: error.message });
  }
}));

export default router;
