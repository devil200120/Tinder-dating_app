// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import swipeRoutes from './routes/swipeRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import boostRoutes from './routes/boostRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

// Import socket handlers
import chatSocket from './sockets/chatSocket.js';
import notificationSocket from './sockets/notificationSocket.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(compression()); // Compress responses

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swipes', swipeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/boosts', boostRoutes);
app.use('/api/locations', locationRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '💕 Dating App API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      swipes: '/api/swipes',
      matches: '/api/matches',
      chats: '/api/chats',
      messages: '/api/messages',
      subscriptions: '/api/subscriptions',
      notifications: '/api/notifications',
      reports: '/api/reports',
      admin: '/api/admin',
      boosts: '/api/boosts',
      locations: '/api/locations'
    },
    documentation: '/api/docs'
  });
});

// Socket.io setup
chatSocket(io);
const notificationNamespace = notificationSocket(io);

// Make io and notification namespace available globally
app.set('io', io);
app.set('notificationNamespace', notificationNamespace);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   💕 DATING APP SERVER STARTED 💕        ║
  ║                                          ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                   ║
  ║   Port: ${PORT}                              ║
  ║   URL: http://localhost:${PORT}              ║
  ║                                          ║
  ║   Socket.io: ✅ Enabled                   ║
  ║   Database: ✅ Connected                  ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;