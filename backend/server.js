import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { upload } from './middleware/uploadMiddleware.js';
import { createAdminIfNotExists } from './utils/adminSeed.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
<<<<<<< HEAD
import recommendationRoutes from './routes/recommendationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import negotiationRoutes from './routes/negotiationRoutes.js';
=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env' });

// Debug environment variables
console.log('Loading environment variables from:', path.resolve('.env'));
console.log('Environment Variables:', {
  JWT_SECRET: process.env.JWT_SECRET ? '****' : undefined,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
});

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

connectDB();

// Create admin user if none exists
createAdminIfNotExists();

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image upload route
app.post('/api/upload', upload.array('images', 5), (req, res) => {
  const uploadedFiles = req.files.map(file => `/uploads/${file.filename}`);
  res.json(uploadedFiles);
});

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working correctly', 
    timestamp: new Date().toISOString(),
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    url: req.url
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
<<<<<<< HEAD
app.use('/api', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/negotiations', negotiationRoutes);
=======
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f

// Error Handling
app.use(notFound);
app.use(errorHandler);


import http from 'http';
import socketService from './socket/socket.js';

const server = http.createServer(app);

<<<<<<< HEAD
// Initialize socket with error handling
try {
  const io = socketService.initialize(server);
  app.set('io', io);
  console.log('✅ Socket.IO initialized successfully');
} catch (error) {
  console.error('❌ Socket.IO initialization failed:', error.message);
  console.log('📡 Continuing without Socket.IO...');
}
=======

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  
  // Join chat room
  socket.on('join', ({ chatId }) => {
    socket.join(`chat_${chatId}`);
    console.log(`Socket ${socket.id} joined chat_${chatId}`);
  });
  
  // Handle typing indicators
  socket.on('typing', ({ chatId, userId, isTyping }) => {
    socket.to(`chat_${chatId}`).emit('typing', { userId, isTyping });
  });
  
  // Handle messages (this is mainly for real-time, actual saving is done in routes)
  socket.on('message', ({ chatId, message }) => {
    io.to(`chat_${chatId}`).emit('message', message);
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Expose io to routes for broadcasting
app.set('io', io);
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f

const PORT = process.env.PORT || 5001;

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://localhost:${PORT}`);
  console.log('Environment variables loaded:', {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI
  });
});
