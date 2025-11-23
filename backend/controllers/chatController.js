// controllers/chatController.js
import Chat from '../models/Chat.js';
import Match from '../models/Match.js';
import Message from '../models/Message.js';

// @desc    Get all chats
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    })
    .populate('participants', 'name photos status')
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 });

    // Format chats with other user info
    const formattedChats = chats.map(chat => {
      const otherUser = chat.participants.find(
        user => user._id.toString() !== req.user._id.toString()
      );

      return {
        _id: chat._id,
        user: otherUser,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        unreadCount: chat.unreadCount.get(req.user._id.toString()) || 0
      };
    });

    res.status(200).json({
      success: true,
      count: formattedChats.length,
      data: formattedChats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single chat
// @route   GET /api/chats/:chatId
// @access  Private
export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name photos status')
      .populate('match');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      user => user._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this chat'
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark chat as read
// @route   PUT /api/chats/:chatId/read
// @access  Private
export const markChatAsRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Reset unread count for current user
    chat.unreadCount.set(req.user._id.toString(), 0);
    await chat.save();

    // Mark all messages as read
    await Message.updateMany(
      {
        chat: chat._id,
        receiver: req.user._id,
        'readBy.user': { $ne: req.user._id }
      },
      {
        $push: {
          readBy: {
            user: req.user._id,
            readAt: new Date()
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Chat marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chats/:chatId
// @access  Private
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      user => user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this chat'
      });
    }

    chat.isActive = false;
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getChats,
  getChat,
  markChatAsRead,
  deleteChat
};