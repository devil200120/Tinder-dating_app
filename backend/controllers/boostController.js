// controllers/boostController.js
import Boost from '../models/Boost.js';
import User from '../models/User.js';

// @desc    Activate profile boost
// @route   POST /api/boosts
// @access  Private
export const activateBoost = async (req, res) => {
  try {
    const { type = 'profile', duration = 30 } = req.body;

    const user = await User.findById(req.user._id);

    // Check if user has premium subscription
    if (!user.hasActiveSubscription()) {
      return res.status(403).json({
        success: false,
        message: 'Profile boost is a premium feature. Please upgrade your subscription.'
      });
    }

    // Check if already has active boost
    if (user.hasActiveBoost()) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active boost'
      });
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Create boost
    const boost = await Boost.create({
      user: req.user._id,
      type,
      duration,
      startTime,
      endTime,
      isActive: true
    });

    // Update user boost status
    user.boost = {
      isActive: true,
      expiresAt: endTime,
      count: user.boost.count + 1
    };
    await user.save();

    res.status(201).json({
      success: true,
      message: `Your profile will be boosted for ${duration} minutes!`,
      data: boost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get boost history
// @route   GET /api/boosts/history
// @access  Private
export const getBoostHistory = async (req, res) => {
  try {
    const boosts = await Boost.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: boosts.length,
      data: boosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active boost
// @route   GET /api/boosts/active
// @access  Private
export const getActiveBoost = async (req, res) => {
  try {
    const boost = await Boost.findOne({
      user: req.user._id,
      isActive: true,
      endTime: { $gt: new Date() }
    });

    res.status(200).json({
      success: true,
      data: boost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  activateBoost,
  getBoostHistory,
  getActiveBoost
};