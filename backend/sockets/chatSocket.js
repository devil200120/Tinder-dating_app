// sockets/chatSocket.js
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const chatSocket = (io) => {
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

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { chatId, content, type = 'text', mediaUrl } = data;

        const chat = await Chat.findById(chatId);
        
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        const receiver = chat.participants.find(
          p => p.toString() !== socket.userId
        );

        // Create message
        const message = await Message.create({
          chat: chatId,
          sender: socket.userId,
          receiver,
          content,
          type,
          mediaUrl
        });

        await message.populate('sender', 'name photos');
        await message.populate('receiver', 'name photos');

        // Update chat
        chat.lastMessage = message._id;
        chat.lastMessageAt = new Date();
        
        const receiverUnreadCount = chat.unreadCount.get(receiver.toString()) || 0;
        chat.unreadCount.set(receiver.toString(), receiverUnreadCount + 1);
        
        await chat.save();

        // Emit to chat room
        io.to(chatId).emit('new-message', message);

        // Emit to receiver's personal room for notification
        io.to(receiver.toString()).emit('message-notification', {
          chatId,
          message,
          sender: socket.user
        });

      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

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

    // Delete message
    socket.on('delete-message', async ({ messageId, chatId }) => {
      try {
        const message = await Message.findById(messageId);
        
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        if (message.sender.toString() !== socket.userId) {
          socket.emit('error', { message: 'Not authorized' });
          return;
        }

        message.isDeleted = true;
        message.deletedAt = new Date();
        await message.save();

        // Emit deletion to chat
        io.to(chatId).emit('message-deleted', {
          messageId
        });

      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      updateUserStatus(socket.userId, false);
    });
  });
};

// Helper function to update user online status
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

export default chatSocket;