// controllers/messageController.js
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';
import multer from 'multer';
import path from 'path';

// Configure multer for message attachments
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/messages/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images, audio, and various file types
  const allowedTypes = /jpeg|jpg|png|gif|webp|wav|mp3|mp4|mov|avi|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image|audio|video|application|text/.test(file.mimetype);

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('File type not supported'));
  }
};

export const uploadMessageFile = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: fileFilter
}).single('file');

// @desc    Get messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const isParticipant = chat.participants.some(
      user => user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view these messages'
      });
    }

    const messages = await Message.find({
      chat: req.params.chatId,
      $and: [
        { isDeleted: { $ne: true } }, // Not deleted for everyone
        {
          $or: [
            { deletedForUsers: { $exists: false } }, // No individual deletions
            { deletedForUsers: { $ne: req.user._id } } // Not deleted for current user
          ]
        }
      ]
    })
    .populate('sender', 'name photos')
    .populate('receiver', 'name photos')
    .populate({
      path: 'replyTo',
      populate: {
        path: 'sender',
        select: 'name photos'
      }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const count = await Message.countDocuments({
      chat: req.params.chatId,
      $and: [
        { isDeleted: { $ne: true } },
        {
          $or: [
            { deletedForUsers: { $exists: false } },
            { deletedForUsers: { $ne: req.user._id } }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, type = 'text', duration, title, replyToId, isSurprise, surpriseEmoji } = req.body;
    let mediaUrl = null;
    let fileName = null;
    let fileSize = null;

    // Handle file upload
    if (req.file) {
      mediaUrl = `/uploads/messages/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;
    }

    // Validate required fields
    if (!chatId || (!content && !mediaUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID and content/file are required'
      });
    }

    // Verify chat and get receiver
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const receiver = chat.participants.find(
      user => user.toString() !== req.user._id.toString()
    );

    // Check if users are blocked
    const Block = (await import('../models/Block.js')).default;
    const blockExists = await Block.findOne({
      $or: [
        { blocker: req.user._id, blocked: receiver, isActive: true },
        { blocker: receiver, blocked: req.user._id, isActive: true }
      ]
    });

    if (blockExists) {
      return res.status(403).json({
        success: false,
        message: 'Cannot send message to blocked user'
      });
    }

    // Prepare message data
    const messageData = {
      chat: chatId,
      sender: req.user._id,
      receiver,
      content: content || '',
      type,
      mediaUrl,
      fileName,
      fileSize
    };

    // Handle reply
    if (replyToId) {
      const replyToMessage = await Message.findById(replyToId);
      if (replyToMessage) {
        messageData.replyTo = replyToId;
        messageData.isReply = true;
      }
    }

    // Add metadata for specific types
    if (type === 'voice' && duration) {
      messageData.metadata = { duration: parseInt(duration) };
    } else if (type === 'gif' && title) {
      messageData.metadata = { title };
    }

    // Handle surprise message
    if (isSurprise || type === 'surprise') {
      messageData.isSurprise = true;
      messageData.type = 'surprise';
      messageData.isRevealed = false;
      if (surpriseEmoji) {
        messageData.surpriseEmoji = surpriseEmoji;
      }
    }

    // Create message
    const message = await Message.create(messageData);

    // Update chat
    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();
    
    // Increment unread count for receiver
    const receiverUnreadCount = chat.unreadCount.get(receiver.toString()) || 0;
    chat.unreadCount.set(receiver.toString(), receiverUnreadCount + 1);
    
    await chat.save();

    // Populate message
    await message.populate('sender', 'name photos');
    await message.populate('receiver', 'name photos');
    if (message.replyTo) {
      await message.populate({
        path: 'replyTo',
        populate: {
          path: 'sender',
          select: 'name photos'
        }
      });
    }

    // Create notification for receiver
    await Notification.create({
      recipient: receiver,
      sender: req.user._id,
      type: 'message',
      title: 'New Message',
      message: `${req.user.name} sent you a ${type === 'text' ? 'message' : type}`,
      data: { chatId, messageId: message._id }
    });

    // Emit socket event for real-time delivery
    const io = req.app.get('io');
    if (io) {
      // Emit to the receiver's room with all necessary data
      const messageForSocket = {
        _id: message._id,
        content: message.content,
        sender: message.sender,
        receiver: message.receiver,
        chat: message.chat,
        type: message.type,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        readBy: message.readBy,
        deliveredTo: message.deliveredTo
      };
      
      io.to(receiver.toString()).emit('new-message', messageForSocket);
      
      // Check if receiver is online by looking at connected sockets
      const receiverSockets = Array.from(io.sockets.sockets.values())
        .filter(socket => socket.userId === receiver.toString());
      
      // If receiver is online, mark as delivered
      if (receiverSockets.length > 0) {
        message.deliveredTo.push({
          user: receiver,
          deliveredAt: new Date()
        });
        await message.save();
        
        // Emit delivery confirmation to sender
        io.to(req.user._id.toString()).emit('message-delivered', {
          messageId: message._id,
          deliveredTo: receiver,
          deliveredAt: new Date()
        });
      }
    }

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const { deleteType } = req.body; // 'me' or 'everyone'
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Add null checks
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!message.sender) {
      return res.status(400).json({
        success: false,
        message: 'Message sender not found'
      });
    }

    const userId = req.user._id.toString();
    const isOwner = message.sender.toString() === userId;

    if (deleteType === 'everyone') {
      // Only message owner can delete for everyone
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own messages for everyone'
        });
      }

      // Delete for everyone
      message.isDeleted = true;
      message.deletedAt = new Date();
      message.deletedBy = userId;
      await message.save();

      // Emit socket event for real-time update to all participants
      const io = req.app.get('io');
      if (io && message.chat) {
        try {
          // Get chat to access participants
          const chat = await Chat.findById(message.chat).populate('participants');
          if (chat) {
            // Emit to all participants
            chat.participants.forEach(participant => {
              io.to(participant._id.toString()).emit('message-deleted', {
                messageId: message._id,
                chatId: message.chat,
                deleteType: 'everyone'
              });
            });
            
            console.log(`Message deleted for everyone - emitted to ${chat.participants.length} participants`);
          }
        } catch (socketError) {
          console.error('Error emitting socket event for message deletion:', socketError);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Message deleted for everyone',
        deleteType: 'everyone'
      });

    } else {
      // Delete for me only
      if (!message.deletedForUsers) {
        message.deletedForUsers = [];
      }
      
      // Check if already deleted for this user
      if (!message.deletedForUsers.includes(userId)) {
        message.deletedForUsers.push(userId);
        await message.save();
      }

      res.status(200).json({
        success: true,
        message: 'Message deleted for you',
        deleteType: 'me'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add reaction to message
// @route   POST /api/messages/:messageId/react
// @access  Private
export const reactToMessage = async (req, res) => {
  console.log('Backend: reactToMessage called', { messageId: req.params.messageId, body: req.body, userId: req.user._id });
  try {
    const { emoji } = req.body;
    const allowedEmojis = ['❤️', '😂', '😮', '😢', '😡', '👍', '👎'];

    if (!emoji || !allowedEmojis.includes(emoji)) {
      console.log('Backend: Invalid emoji', { emoji, allowedEmojis });
      return res.status(400).json({
        success: false,
        message: 'Invalid emoji'
      });
    }

    const message = await Message.findById(req.params.messageId);
    console.log('Backend: Message found', { messageId: req.params.messageId, found: !!message });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user already reacted
    const existingReaction = message.reactions.find(
      r => r.user.toString() === req.user._id.toString()
    );
    console.log('Backend: Existing reaction check', { existingReaction: !!existingReaction, reactionsCount: message.reactions.length });

    if (existingReaction) {
      console.log('Backend: Updating existing reaction');
      existingReaction.emoji = emoji;
      existingReaction.reactedAt = new Date();
    } else {
      console.log('Backend: Adding new reaction');
      message.reactions.push({
        user: req.user._id,
        emoji,
        reactedAt: new Date()
      });
    }

    await message.save();
    console.log('Backend: Message saved with reactions', { reactionsCount: message.reactions.length });

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io && message.chat) {
      try {
        const chat = await Chat.findById(message.chat).populate('participants');
        if (chat) {
          chat.participants.forEach(participant => {
            io.to(participant._id.toString()).emit('message-reaction', {
              messageId: message._id,
              userId: req.user._id,
              emoji,
              reactions: message.reactions
            });
          });
        }
      } catch (socketError) {
        console.error('Error emitting socket event for reaction:', socketError);
      }
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove reaction from message
// @route   DELETE /api/messages/:messageId/react
// @access  Private
export const removeReactionFromMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    
    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }

    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Remove user's reaction
    message.reactions = message.reactions.filter(
      r => !(r.user.toString() === req.user._id.toString() && r.emoji === emoji)
    );

    await message.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io && message.chat) {
      try {
        const chat = await Chat.findById(message.chat).populate('participants');
        if (chat) {
          chat.participants.forEach(participant => {
            io.to(participant._id.toString()).emit('message-reaction', {
              messageId: message._id,
              userId: req.user._id,
              emoji,
              reactions: message.reactions
            });
          });
        }
      } catch (socketError) {
        console.error('Error emitting socket event for reaction removal:', socketError);
      }
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Edit message
// @route   PUT /api/messages/:messageId
// @access  Private
export const editMessage = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only the message sender can edit
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages'
      });
    }

    // Check if message is already deleted
    if (message.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit deleted message'
      });
    }

    // Store original content if this is the first edit
    if (!message.isEdited) {
      message.originalContent = message.content;
    }

    // Update message content
    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    // Populate the message for response
    await message.populate('sender', 'name photos');
    await message.populate('receiver', 'name photos');
    if (message.replyTo) {
      await message.populate({
        path: 'replyTo',
        populate: {
          path: 'sender',
          select: 'name photos'
        }
      });
    }

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io && message.chat) {
      try {
        const chat = await Chat.findById(message.chat).populate('participants');
        if (chat) {
          chat.participants.forEach(participant => {
            io.to(participant._id.toString()).emit('message-edited', {
              messageId: message._id,
              content: message.content,
              isEdited: message.isEdited,
              editedAt: message.editedAt,
              chatId: message.chat
            });
          });
        }
      } catch (socketError) {
        console.error('Error emitting socket event for message edit:', socketError);
      }
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reveal surprise message
export const revealSurpriseMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId)
      .populate('sender', 'name photos')
      .populate('receiver', 'name photos');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is authorized to reveal (must be receiver)
    if (message.receiver._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reveal this surprise message'
      });
    }

    // Check if it's a surprise message
    if (!message.isSurprise) {
      return res.status(400).json({
        success: false,
        message: 'This is not a surprise message'
      });
    }

    // Mark as revealed
    message.isRevealed = true;
    message.revealedAt = new Date();
    await message.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io && message.chat) {
      try {
        const chat = await Chat.findById(message.chat).populate('participants');
        if (chat) {
          chat.participants.forEach(participant => {
            io.to(participant._id.toString()).emit('surprise-revealed', {
              messageId: message._id,
              isRevealed: true,
              revealedAt: message.revealedAt,
              chatId: message.chat
            });
          });
        }
      } catch (socketError) {
        console.error('Error emitting socket event for surprise reveal:', socketError);
      }
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId)
      .populate('sender', 'name photos')
      .populate('receiver', 'name photos');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the receiver
    if (message.receiver._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this message as read'
      });
    }

    // Check if already read by this user
    const alreadyRead = message.readBy.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        user: req.user._id,
        readAt: new Date()
      });
      await message.save();

      // Emit socket event for read receipt
      const io = req.app.get('io');
      if (io) {
        io.to(message.sender._id.toString()).emit('message-read', {
          messageId: message._id,
          readBy: req.user._id,
          readAt: new Date(),
          chatId: message.chat
        });
      }
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getMessages,
  sendMessage,
  deleteMessage,
  reactToMessage,
  removeReactionFromMessage,
  editMessage,
  revealSurpriseMessage,
  markMessageAsRead,
  uploadMessageFile
};