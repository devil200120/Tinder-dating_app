// controllers/blockController.js
import Block from '../models/Block.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Match from '../models/Match.js';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

// @desc    Block a user completely
// @route   POST /api/blocks/:userId
// @access  Private
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, description, blockType = 'complete' } = req.body;

    // Check if user exists
    const userToBlock = await User.findById(userId);
    if (!userToBlock) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-blocking
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot block yourself'
      });
    }

    // Check if already blocked
    const existingBlock = await Block.findOne({
      blocker: req.user._id,
      blocked: userId,
      isActive: true
    });

    if (existingBlock) {
      return res.status(409).json({
        success: false,
        message: 'User is already blocked'
      });
    }

    // Create block record
    const block = await Block.create({
      blocker: req.user._id,
      blocked: userId,
      blockType,
      reason,
      description
    });

    // For complete block, remove all interactions
    if (blockType === 'complete') {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Remove from matches
        await Match.deleteMany({
          $or: [
            { user: req.user._id, matchedUser: userId },
            { user: userId, matchedUser: req.user._id }
          ]
        }, { session });

        // Delete chat and messages
        const chats = await Chat.find({
          participants: { $all: [req.user._id, userId] }
        }, null, { session });

        for (const chat of chats) {
          // Delete all messages in the chat
          await Message.deleteMany({ chat: chat._id }, { session });
          // Delete the chat
          await Chat.findByIdAndDelete(chat._id, { session });
        }

        // Update user's blocked list
        await User.findByIdAndUpdate(
          req.user._id,
          { $addToSet: { blockedUsers: userId } },
          { session }
        );

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }

    // Populate block data
    const populatedBlock = await Block.findById(block._id)
      .populate('blocked', 'name photos')
      .lean();

    res.status(201).json({
      success: true,
      message: 'User blocked successfully',
      data: populatedBlock
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unblock a user
// @route   DELETE /api/blocks/:userId
// @access  Private
export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and update block record
    const block = await Block.findOneAndUpdate(
      {
        blocker: req.user._id,
        blocked: userId,
        isActive: true
      },
      { isActive: false },
      { new: true }
    ).populate('blocked', 'name photos');

    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Block record not found'
      });
    }

    // Remove from user's blocked list
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { blockedUsers: userId } }
    );

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully',
      data: block
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blocked users list
// @route   GET /api/blocks
// @access  Private
export const getBlockedUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const blocks = await Block.find({
      blocker: req.user._id,
      isActive: true
    })
      .populate('blocked', 'name photos age bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Block.countDocuments({
      blocker: req.user._id,
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: blocks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlocks: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if user is blocked
// @route   GET /api/blocks/:userId/status
// @access  Private
export const checkBlockStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const isBlocked = await Block.findOne({
      blocker: req.user._id,
      blocked: userId,
      isActive: true
    }).lean();

    const isBlockedBy = await Block.findOne({
      blocker: userId,
      blocked: req.user._id,
      isActive: true
    }).lean();

    res.status(200).json({
      success: true,
      data: {
        isBlocked: !!isBlocked,
        isBlockedBy: !!isBlockedBy,
        blockType: isBlocked?.blockType || null,
        blockedAt: isBlocked?.createdAt || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get block reasons
// @route   GET /api/blocks/reasons
// @access  Private
export const getBlockReasons = async (req, res) => {
  try {
    const reasons = [
      { value: 'harassment', label: 'Harassment or Bullying' },
      { value: 'inappropriate_content', label: 'Inappropriate Content' },
      { value: 'spam', label: 'Spam or Promotional Content' },
      { value: 'fake_profile', label: 'Fake or Misleading Profile' },
      { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
      { value: 'other', label: 'Other' }
    ];

    res.status(200).json({
      success: true,
      data: reasons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get users who blocked current user
// @route   GET /api/blocks/blocked-by
// @access  Private
export const getUsersWhoBlockedMe = async (req, res) => {
  try {
    const blocks = await Block.find({
      blocked: req.user._id,
      isActive: true
    })
      .populate('blocker', 'name')
      .select('blocker createdAt reason blockType')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: blocks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};