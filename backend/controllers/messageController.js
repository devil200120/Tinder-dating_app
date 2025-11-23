// controllers/messageController.js
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';

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
      isDeleted: false
    })
    .populate('sender', 'name photos')
    .populate('receiver', 'name photos')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const count = await Message.countDocuments({
      chat: req.params.chatId,
      isDeleted: false
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
    const { chatId, content, type = 'text', mediaUrl } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID and content are required'
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

    // Create message
    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      receiver,
      content,
      type,
      mediaUrl
    });

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

    // Create notification for receiver
    await Notification.create({
      recipient: receiver,
      sender: req.user._id,
      type: 'message',
      title: 'New Message',
      message: `${req.user.name} sent you a message`,
      data: { chatId, messageId: message._id }
    });

    res.status(201).json({
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

// @desc    Delete message
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can delete
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
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
  try {
    const { emoji } = req.body;
    const allowedEmojis = ['❤️', '😂', '😮', '😢', '😡', '👍', '👎'];

    if (!emoji || !allowedEmojis.includes(emoji)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid emoji'
      });
    }

    const message = await Message.findById(req.params.messageId);

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

    if (existingReaction) {
      existingReaction.emoji = emoji;
      existingReaction.reactedAt = new Date();
    } else {
      message.reactions.push({
        user: req.user._id,
        emoji,
        reactedAt: new Date()
      });
    }

    await message.save();

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
  reactToMessage
};