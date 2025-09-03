import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:5174'],
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Add authentication middleware
    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          console.log('Socket connection without token, allowing connection');
          return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        console.log(`Socket authenticated for user: ${decoded.id}`);
        next();
      } catch (err) {
        console.log('Socket authentication failed:', err.message);
        // Allow connection even if token is invalid for now
        next();
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id, socket.userId ? `(User: ${socket.userId})` : '(Anonymous)');
      
      // Handle user joining their notification room
      socket.on('join_user_room', (userId) => {
        console.log(`User ${userId} joined their notification room`);
        socket.join(`user_${userId}`);
        this.connectedUsers.set(socket.id, userId);
      });

      // Handle joining chat rooms
      socket.on('join', ({ chatId }) => {
        const roomName = `chat_${chatId}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined ${roomName}`);
      });

      // Handle leaving chat rooms
      socket.on('leave', ({ chatId }) => {
        const roomName = `chat_${chatId}`;
        socket.leave(roomName);
        console.log(`Socket ${socket.id} left ${roomName}`);
      });

      // Handle typing indicators
      socket.on('typing', ({ chatId, userId, isTyping }) => {
        console.log(`Typing event: User ${userId} in chat ${chatId}, typing: ${isTyping}`);
        socket.to(`chat_${chatId}`).emit('typing', { userId, isTyping });
      });

      // Handle chat messages (real-time broadcasting)
      socket.on('message', ({ chatId, message }) => {
        console.log(`Broadcasting message in chat ${chatId}:`, message);
        this.io.to(`chat_${chatId}`).emit('message', message);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        this.connectedUsers.delete(socket.id);
      });
    });

    return this.io;
  }

  // Send notification to a specific user
  sendNotificationToUser(userId, notification) {
    if (this.io) {
      console.log(`Sending notification to user ${userId}:`, notification.title);
      this.io.to(`user_${userId}`).emit('new_notification', notification);
    }
  }

  // Send notification update to a specific user
  sendNotificationUpdate(userId, notificationData) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit('notification_updated', notificationData);
    }
  }

  // Broadcast message to chat room
  broadcastToChatRoom(chatId, eventName, data) {
    if (this.io) {
      this.io.to(`chat_${chatId}`).emit(eventName, data);
    }
  }

  // Broadcast to all connected users
  broadcastToAll(eventName, data) {
    if (this.io) {
      this.io.emit(eventName, data);
    }
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Check if user is connected
  isUserConnected(userId) {
    return Array.from(this.connectedUsers.values()).includes(userId);
  }

  // Get socket instance
  getIO() {
    return this.io;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;