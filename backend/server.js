// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
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
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      mediaSrc: ["'self'", "blob:", "data:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(compression()); // Compress responses

// Serve static files with proper CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads', {
  setHeaders: (res, path, stat) => {
    // Set proper MIME types for audio files
    if (path.endsWith('.wav')) {
      res.set('Content-Type', 'audio/wav');
    } else if (path.endsWith('.mp3')) {
      res.set('Content-Type', 'audio/mpeg');
    } else if (path.endsWith('.m4a')) {
      res.set('Content-Type', 'audio/mp4');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (path.endsWith('.gif')) {
      res.set('Content-Type', 'image/gif');
    } else if (path.endsWith('.webp')) {
      res.set('Content-Type', 'image/webp');
    }
    // Allow cross-origin access
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

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

// Handle audio file requests specifically
app.get('/uploads/messages/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', 'messages', filename);
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Set content type based on file extension
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.wav') {
    res.set('Content-Type', 'audio/wav');
  } else if (ext === '.mp3') {
    res.set('Content-Type', 'audio/mpeg');
  } else if (ext === '.m4a') {
    res.set('Content-Type', 'audio/mp4');
  } else if (ext === '.jpg' || ext === '.jpeg') {
    res.set('Content-Type', 'image/jpeg');
  } else if (ext === '.png') {
    res.set('Content-Type', 'image/png');
  } else if (ext === '.gif') {
    res.set('Content-Type', 'image/gif');
  } else if (ext === '.webp') {
    res.set('Content-Type', 'image/webp');
  }
  
  // Send file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(404).json({ error: 'File not found' });
    }
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