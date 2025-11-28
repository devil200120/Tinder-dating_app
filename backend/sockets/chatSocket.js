// sockets/chatSocket.js
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const chatSocket = (io) => {
  // Helper function to emit status updates to user's contacts
  const emitStatusToContacts = async (userId, isOnline) => {
    try {
      // Find all chats where this user is a participant
      const chats = await Chat.find({
        participants: userId
      }).populate('participants', '_id');

      // Get all contact IDs
      const contactIds = [];
      chats.forEach(chat => {
        chat.participants.forEach(participant => {
          if (participant._id.toString() !== userId) {
            contactIds.push(participant._id.toString());
          }
        });
      });

      // Remove duplicates
      const uniqueContactIds = [...new Set(contactIds)];

      // Emit status update to each contact
      uniqueContactIds.forEach(contactId => {
        io.to(contactId).emit('user-status-update', {
          userId,
          isOnline,
          lastSeen: new Date()
        });
      });
    } catch (error) {
      console.error('Error emitting status to contacts:', error);
    }
  };

  // Helper function to update user status in database
  const updateUserStatus = async (userId, isOnline) => {
    try {
      await User.findByIdAndUpdate(userId, {
        'status.isOnline': isOnline,
        'status.lastSeen': new Date()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
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

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user to their personal room
    socket.join(socket.userId);

    // Update user online status
    updateUserStatus(socket.userId, true);

    // Emit user online status to their contacts
    emitStatusToContacts(socket.userId, true);

    // Join chat rooms
    socket.on('join-chat', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Check if user is participant
        const isParticipant = chat.participants.some(
          p => p.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized' });
          return;
        }

        socket.join(chatId);
        console.log(`User ${socket.userId} joined chat ${chatId}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Leave chat room
    socket.on('leave-chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    // Send message - Handled by HTTP API, this socket handler is redundant
    // The HTTP API in messageController.js already handles message creation and socket emission
    // Removing this handler to prevent duplicate messages
    // socket.on('send-message', async (data) => { ... });

    // Typing indicator
    socket.on('typing-start', ({ chatId }) => {
      socket.to(chatId).emit('user-typing', {
        userId: socket.userId,
        chatId
      });
    });

    socket.on('typing-stop', ({ chatId }) => {
      socket.to(chatId).emit('user-stopped-typing', {
        userId: socket.userId,
        chatId
      });
    });

    // Message read
    socket.on('message-read', async ({ messageId, chatId }) => {
      try {
        const message = await Message.findById(messageId);
        
        if (message && !message.readBy.some(r => r.user.toString() === socket.userId)) {
          message.readBy.push({
            user: socket.userId,
            readAt: new Date()
          });
          await message.save();

          // Emit read receipt
          io.to(chatId).emit('message-read-receipt', {
            messageId,
            userId: socket.userId,
            readAt: new Date()
          });
        }
      } catch (error) {
        console.error('Message read error:', error);
      }
    });

    // React to message
    socket.on('react-to-message', async ({ messageId, emoji, chatId }) => {
      try {
        const message = await Message.findById(messageId);
        
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        const existingReaction = message.reactions.find(
          r => r.user.toString() === socket.userId
        );

        if (existingReaction) {
          existingReaction.emoji = emoji;
          existingReaction.reactedAt = new Date();
        } else {
          message.reactions.push({
            user: socket.userId,
            emoji,
            reactedAt: new Date()
          });
        }

        await message.save();

        // Emit reaction to chat
        io.to(chatId).emit('message-reaction', {
          messageId,
          userId: socket.userId,
          emoji,
          reactions: message.reactions
        });

      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Delete message - Handled by HTTP API
    // This handler is removed to prevent duplicate handling
    // All message deletion is handled through the REST API endpoint

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      updateUserStatus(socket.userId, false);
      // Emit user offline status to their contacts
      emitStatusToContacts(socket.userId, false);
    });
  });
};

export default chatSocket;