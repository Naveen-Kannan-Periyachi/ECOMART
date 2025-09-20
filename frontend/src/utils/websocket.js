import { io } from 'socket.io-client';
import { store } from '../app/store.js';
import { addRealTimeNotification } from '../features/notificationSlice.js';
import config from '../config/config.js';
import logger from './logger.js';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }

    const serverURL = config.SOCKET_URL;
    
    this.socket = io(serverURL, {
      transports: ['websocket', 'polling'], // Add polling fallback
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      query: { userId }
    });

    this.socket.on('connect', () => {
      logger.log('WebSocket connected');
      this.isConnected = true;
      
      // Join user's notification room
      if (userId) {
        this.socket.emit('join_user_room', userId);
      }
    });

    this.socket.on('disconnect', () => {
      logger.log('WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      logger.error('WebSocket connection error:', error);
      // Don't throw error, just log it
    });

    // Handle real-time notifications
    this.socket.on('new_notification', (notification) => {
      logger.log('Received real-time notification:', notification);
      store.dispatch(addRealTimeNotification(notification));
    });

    // Handle notification updates (read status, etc.)
    this.socket.on('notification_updated', (notificationData) => {
      logger.log('Notification updated:', notificationData);
      // You can dispatch additional actions here if needed
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join a chat room
  joinChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join', { chatId });
    }
  }

  // Leave a chat room
  leaveChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave', { chatId });
    }
  }

  // Send a message
  sendMessage(chatId, message) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message', { chatId, message });
    }
  }

  // Send typing indicator
  sendTyping(chatId, userId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { chatId, userId, isTyping });
    }
  }

  // Listen for chat events
  onMessage(callback) {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  // Remove listeners
  offMessage() {
    if (this.socket) {
      this.socket.off('message');
    }
  }

  offTyping() {
    if (this.socket) {
      this.socket.off('typing');
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
