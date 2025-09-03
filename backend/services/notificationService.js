import Notification from '../models/notificationModel.js';
import socketService from '../socket/socket.js';
import { Server as SocketIOServer } from 'socket.io';

class NotificationService {
  constructor(io) {
    this.io = io || socketService.getIO();
  }

  /**
   * Create and send a notification
   * @param {Object} notificationData 
   * @param {String} notificationData.userId - Recipient user ID
   * @param {String} notificationData.type - Notification type
   * @param {String} notificationData.title - Notification title
   * @param {String} notificationData.message - Notification message
   * @param {Object} notificationData.data - Additional data
   * @param {String} notificationData.actionUrl - Action URL
   * @param {String} notificationData.priority - Priority level
   * @param {Date} notificationData.expiresAt - Expiration date
   */
  async createNotification(notificationData) {
    try {
      // Create notification in database
      const notification = await Notification.create(notificationData);
      
      // Populate any references if needed
      await notification.populate('userId', 'name email');

      // Send real-time notification via Socket.IO
      if (this.io) {
        this.io.to(`user_${notificationData.userId}`).emit('new_notification', {
          _id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          data: notification.data,
          actionUrl: notification.actionUrl,
          priority: notification.priority,
          createdAt: notification.createdAt
        });
      } else {
        // Fallback to socket service
        socketService.sendNotificationToUser(notificationData.userId, {
          _id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          data: notification.data,
          actionUrl: notification.actionUrl,
          priority: notification.priority,
          createdAt: notification.createdAt
        });
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create message notification
   */
  async createMessageNotification(senderId, receiverId, chatId, messageContent) {
    const senderName = await this.getUserName(senderId);
    
    return this.createNotification({
      userId: receiverId,
      type: 'NEW_MESSAGE',
      title: `New message from ${senderName}`,
      message: messageContent.length > 50 
        ? `${messageContent.substring(0, 50)}...` 
        : messageContent,
      data: { 
        senderId, 
        chatId,
        senderName 
      },
      actionUrl: `/chats/${chatId}`,
      priority: 'MEDIUM'
    });
  }

  /**
   * Create product sold notification
   */
  async createProductSoldNotification(sellerId, productId, productTitle, buyerName) {
    return this.createNotification({
      userId: sellerId,
      type: 'PRODUCT_SOLD',
      title: 'Product Sold Successfully!',
      message: `Your product "${productTitle}" has been sold to ${buyerName}`,
      data: { 
        productId,
        productTitle,
        buyerName 
      },
      actionUrl: `/products/${productId}`,
      priority: 'HIGH'
    });
  }

  /**
   * Create product inquiry notification
   */
  async createProductInquiryNotification(sellerId, productId, productTitle, inquirerName) {
    return this.createNotification({
      userId: sellerId,
      type: 'PRODUCT_INQUIRY',
      title: 'New Product Inquiry',
      message: `${inquirerName} is interested in your product "${productTitle}"`,
      data: { 
        productId,
        productTitle,
        inquirerName 
      },
      actionUrl: `/products/${productId}`,
      priority: 'MEDIUM'
    });
  }

  /**
   * Create review notification
   */
  async createReviewNotification(sellerId, productId, productTitle, reviewerName, rating) {
    return this.createNotification({
      userId: sellerId,
      type: 'REVIEW_RECEIVED',
      title: 'New Review Received',
      message: `${reviewerName} left a ${rating}-star review for "${productTitle}"`,
      data: { 
        productId,
        productTitle,
        reviewerName,
        rating 
      },
      actionUrl: `/products/${productId}`,
      priority: 'MEDIUM'
    });
  }

  /**
   * Create order update notification
   */
  async createOrderUpdateNotification(userId, orderId, status, productTitle) {
    const statusMessages = {
      'pending': 'Your order is being processed',
      'confirmed': 'Your order has been confirmed',
      'shipped': 'Your order has been shipped',
      'delivered': 'Your order has been delivered',
      'cancelled': 'Your order has been cancelled'
    };

    return this.createNotification({
      userId,
      type: 'ORDER_UPDATE',
      title: 'Order Status Updated',
      message: `${statusMessages[status]} for "${productTitle}"`,
      data: { 
        orderId,
        status,
        productTitle 
      },
      actionUrl: `/orders/${orderId}`,
      priority: status === 'delivered' ? 'HIGH' : 'MEDIUM'
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );

      if (notification && this.io) {
        this.io.to(`user_${userId}`).emit('notificationRead', notificationId);
      }

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );

      if (this.io) {
        this.io.to(`user_${userId}`).emit('allNotificationsRead');
      }

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get user notifications with pagination
   */
  async getUserNotifications(userId, page = 1, limit = 20, unreadOnly = false) {
    try {
      const query = { userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ userId, isRead: false });

      return {
        notifications,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        unreadCount
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Delete old notifications (cleanup job)
   */
  async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        isRead: true
      });

      console.log(`Cleaned up ${result.deletedCount} old notifications`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      throw error;
    }
  }

  /**
   * Helper function to get user name
   */
  async getUserName(userId) {
    try {
      const User = mongoose.model('User');
      const user = await User.findById(userId).select('name');
      return user ? user.name : 'Unknown User';
    } catch (error) {
      return 'Unknown User';
    }
  }
}

export default NotificationService;
