// sockets/notificationSocket.js
import Notification from '../models/Notification.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const notificationSocket = (io) => {
  const notificationNamespace = io.of('/notifications');

  // Middleware
  notificationNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  notificationNamespace.on('connection', (socket) => {
    console.log(`✅ Notification socket connected: ${socket.userId}`);

    // Join user to their notification room
    socket.join(`notifications-${socket.userId}`);

    // Get unread count
    socket.on('get-unread-count', async () => {
      try {
        const count = await Notification.countDocuments({
          recipient: socket.userId,
          isRead: false
        });

        socket.emit('unread-count', count);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Mark notification as read
    socket.on('mark-as-read', async (notificationId) => {
      try {
        const notification = await Notification.findById(notificationId);
        
        if (notification && notification.recipient.toString() === socket.userId) {
          notification.isRead = true;
          notification.readAt = new Date();
          await notification.save();

          socket.emit('notification-read', notificationId);
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Mark all as read
    socket.on('mark-all-as-read', async () => {
      try {
        await Notification.updateMany(
          { recipient: socket.userId, isRead: false },
          { isRead: true, readAt: new Date() }
        );

        socket.emit('all-notifications-read');
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Notification socket disconnected: ${socket.userId}`);
    });
  });

  // Helper function to send notification (can be called from anywhere)
  notificationNamespace.sendNotification = async (notification) => {
    try {
      const savedNotification = await Notification.create(notification);
      await savedNotification.populate('sender', 'name photos');

      // Emit to user's notification room
      notificationNamespace
        .to(`notifications-${notification.recipient}`)
        .emit('new-notification', savedNotification);

      return savedNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return notificationNamespace;
};

export default notificationSocket;