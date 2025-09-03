import axios from 'axios';
import config from '../config/config.js';

const API_URL = config.API_URL;

// Create axios instance with auth interceptor
const notificationAPI = axios.create({
  baseURL: `${API_URL}/notifications`,
});

// Add auth token to requests
notificationAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class NotificationService {
  // Get user notifications with pagination
  static async getNotifications(page = 1, limit = 20, unreadOnly = false) {
    try {
      const response = await notificationAPI.get('/', {
        params: { page, limit, unreadOnly }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Get unread notification count
  static async getUnreadCount() {
    try {
      const response = await notificationAPI.get('/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const response = await notificationAPI.patch(`/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    try {
      const response = await notificationAPI.patch('/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId) {
    try {
      const response = await notificationAPI.delete(`/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Create test notification (development only)
  static async createTestNotification() {
    try {
      const response = await notificationAPI.post('/test');
      return response.data;
    } catch (error) {
      console.error('Error creating test notification:', error);
      throw error;
    }
  }

  // Request browser notification permission
  static async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Show browser notification
  static showBrowserNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      });

      notification.onclick = function(event) {
        event.preventDefault();
        window.focus();
        if (options.actionUrl) {
          window.location.href = options.actionUrl;
        }
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }
  }

  // Format notification for display
  static formatNotification(notification) {
    const timeAgo = this.getTimeAgo(new Date(notification.createdAt));
    
    return {
      ...notification,
      timeAgo,
      isNew: !notification.isRead && this.isRecent(new Date(notification.createdAt)),
      icon: this.getNotificationIcon(notification.type),
      color: this.getNotificationColor(notification.priority)
    };
  }

  // Get notification icon based on type
  static getNotificationIcon(type) {
    const iconMap = {
      NEW_MESSAGE: '💬',
      NEW_ORDER: '🛒',
      ORDER_CONFIRMED: '✅',
      ORDER_SHIPPED: '🚚',
      ORDER_DELIVERED: '📦',
      PRODUCT_INTEREST: '❤️',
      PRICE_DROP: '💰',
      PRICE_NEGOTIATION: '💸',
      NEGOTIATION_ACCEPTED: '🤝',
      NEGOTIATION_REJECTED: '❌',
      NEGOTIATION_COUNTER: '🔄',
      SYSTEM_UPDATE: '🔔'
    };
    return iconMap[type] || '📢';
  }

  // Get notification color based on priority
  static getNotificationColor(priority) {
    const colorMap = {
      LOW: '#666',
      MEDIUM: '#2196F3',
      HIGH: '#FF9800',
      URGENT: '#F44336'
    };
    return colorMap[priority] || '#666';
  }

  // Calculate time ago
  static getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Check if notification is recent (within 5 minutes)
  static isRecent(date) {
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    return diffInMinutes <= 5;
  }

  // Group notifications by date
  static groupNotificationsByDate(notifications) {
    const groups = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.createdAt);
      const dateKey = this.getDateKey(date);
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(this.formatNotification(notification));
    });

    return groups;
  }

  // Get date key for grouping
  static getDateKey(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const notificationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (notificationDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (notificationDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return notificationDate.toLocaleDateString();
    }
  }
}

export default NotificationService;
