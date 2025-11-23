// controllers/matchController.js
import Match from '../models/Match.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';

// @desc    Get all matches
// @route   GET /api/matches
// @access  Private
export const getMatches = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const matches = await Match.find({
      users: req.user._id,
      isActive: true
    })
    .populate('users', 'name age photos bio location status')
    .populate({
      path: 'chat',
      populate: {
        path: 'lastMessage',
        select: 'content createdAt sender'
      }
    })
    .sort({ matchedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const count = await Match.countDocuments({
      users: req.user._id,
      isActive: true
    });

    // Format matches
    const formattedMatches = matches.map(match => {
      const matchedUser = match.users.find(
        user => user._id.toString() !== req.user._id.toString()
      );

      return {
        _id: match._id,
        user: matchedUser,
        matchedAt: match.matchedAt,
        chat: match.chat
      };
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: formattedMatches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single match
// @route   GET /api/matches/:matchId
// @access  Private
export const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId)
      .populate('users', 'name age photos bio occupation education interests location status')
      .populate('chat');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Check if user is part of this match
    const isUserInMatch = match.users.some(
      user => user._id.toString() === req.user._id.toString()
    );

    if (!isUserInMatch) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this match'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unmatch with user
// @route   DELETE /api/matches/:matchId
// @access  Private
export const unmatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Check if user is part of this match
    const isUserInMatch = match.users.some(
      user => user.toString() === req.user._id.toString()
    );

    if (!isUserInMatch) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to unmatch this user'
      });
    }

    // Soft delete match
    match.isActive = false;
    match.unmatchedBy = req.user._id;
    match.unmatchedAt = new Date();
    await match.save();

    // Deactivate chat
    if (match.chat) {
      await Chat.findByIdAndUpdate(match.chat, { isActive: false });
    }

    // Update match stats
    await User.updateMany(
      { _id: { $in: match.users } },
      { $inc: { 'stats.matches': -1 } }
    );

    res.status(200).json({
      success: true,
      message: 'Unmatched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getMatches,
  getMatch,
  unmatch
};