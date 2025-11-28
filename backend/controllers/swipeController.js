// controllers/swipeController.js
import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';
import Block from '../models/Block.js';
import { calculateDistance } from '../utils/distanceCalculator.js';

// @desc    Get potential matches (users to swipe)
// @route   GET /api/swipes/potential
// @access  Private
export const getPotentialMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const { limit = 10 } = req.query;

    // Get users already swiped
    const swipedUsers = await Swipe.find({ swiper: req.user._id })
      .select('swiped');
    const swipedUserIds = swipedUsers.map(s => s.swiped.toString());

    // Get blocked users
    const blockedUsers = await Block.find({
      $or: [
        { blocker: req.user._id },
        { blocked: req.user._id }
      ]
    });
    const blockedUserIds = blockedUsers.map(b => 
      b.blocker.toString() === req.user._id.toString() ? b.blocked.toString() : b.blocker.toString()
    );

    // Build query
    const query = {
      _id: { 
        $ne: req.user._id,
        $nin: [...swipedUserIds, ...blockedUserIds]
      },
      isActive: true,
      isBanned: false,
      'photos.0': { $exists: true } // Has at least one photo
    };

    // Gender preference filter
    if (!currentUser.genderPreference.includes('everyone')) {
      query.gender = { $in: currentUser.genderPreference };
    }

    // Age preference filter
    query.age = {
      $gte: currentUser.preferences.ageRange.min,
      $lte: currentUser.preferences.ageRange.max
    };

    // Location-based filtering
    if (currentUser.location && currentUser.location.coordinates) {
      const [longitude, latitude] = currentUser.location.coordinates;
      const maxDistance = currentUser.preferences.distanceRange * 1000; // Convert km to meters

      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance
        }
      };
    }

    // Get potential matches
    let potentialMatches = await User.find(query)
      .limit(parseInt(limit))
      .select('name age gender photos bio occupation interests location stats');

    // Calculate distance for each user
    if (currentUser.location && currentUser.location.coordinates) {
      potentialMatches = potentialMatches.map(user => {
        const userObj = user.toObject();
        if (user.location && user.location.coordinates) {
          userObj.distance = calculateDistance(
            currentUser.location.coordinates[1],
            currentUser.location.coordinates[0],
            user.location.coordinates[1],
            user.location.coordinates[0]
          );
        }
        return userObj;
      });
    }

    // Boost active users to top
    potentialMatches.sort((a, b) => {
      if (a.boost?.isActive && !b.boost?.isActive) return -1;
      if (!a.boost?.isActive && b.boost?.isActive) return 1;
      return 0;
    });

    res.status(200).json({
      success: true,
      count: potentialMatches.length,
      data: potentialMatches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Swipe on a user (like/dislike/superlike)
// @route   POST /api/swipes
// @access  Private
export const swipeUser = async (req, res) => {
  try {
    const { swipedUserId, type } = req.body;

    if (!swipedUserId || !type) {
      return res.status(400).json({
        success: false,
        message: 'Swiped user ID and swipe type are required'
      });
    }

    if (!['like', 'dislike', 'superlike'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid swipe type'
      });
    }

    // Check if swiped user exists
    const swipedUser = await User.findById(swipedUserId);
    if (!swipedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check for existing swipe
    const existingSwipe = await Swipe.findOne({
      swiper: req.user._id,
      swiped: swipedUserId
    });

    if (existingSwipe && !existingSwipe.undone) {
      return res.status(400).json({
        success: false,
        message: 'You have already swiped on this user'
      });
    }

    // Create or update swipe
    let swipe;
    if (existingSwipe) {
      existingSwipe.type = type;
      existingSwipe.undone = false;
      existingSwipe.undoneAt = undefined;
      swipe = await existingSwipe.save();
    } else {
      swipe = await Swipe.create({
        swiper: req.user._id,
        swiped: swipedUserId,
        type
      });
    }

    // Update stats
    const currentUser = await User.findById(req.user._id);
    if (type === 'like') {
      currentUser.stats.likesGiven += 1;
      swipedUser.stats.likesReceived += 1;
    } else if (type === 'superlike') {
      currentUser.stats.superLikesGiven += 1;
      swipedUser.stats.superLikesReceived += 1;

      // Send notification for superlike
      await Notification.create({
        recipient: swipedUserId,
        sender: req.user._id,
        type: 'superlike',
        title: 'Someone Super Liked You!',
        message: `${currentUser.name} super liked you!`,
        data: { userId: req.user._id }
      });
    }

    await currentUser.save();
    await swipedUser.save();

    // Check for match (if both liked each other)
    let match = null;
    if (type === 'like' || type === 'superlike') {
      const reciprocalSwipe = await Swipe.findOne({
        swiper: swipedUserId,
        swiped: req.user._id,
        type: { $in: ['like', 'superlike'] },
        undone: false
      });

      if (reciprocalSwipe) {
        // Create match
        match = await Match.create({
          users: [req.user._id, swipedUserId]
        });

        // Create chat for the match
        const chat = await Chat.create({
          match: match._id,
          participants: [req.user._id, swipedUserId]
        });

        match.chat = chat._id;
        await match.save();

        // Update match stats
        currentUser.stats.matches += 1;
        swipedUser.stats.matches += 1;
        await currentUser.save();
        await swipedUser.save();

        // Send match notifications to both users
        await Notification.create([
          {
            recipient: req.user._id,
            sender: swipedUserId,
            type: 'match',
            title: "It's a Match!",
            message: `You and ${swipedUser.name} liked each other!`,
            data: { matchId: match._id, userId: swipedUserId }
          },
          {
            recipient: swipedUserId,
            sender: req.user._id,
            type: 'match',
            title: "It's a Match!",
            message: `You and ${currentUser.name} liked each other!`,
            data: { matchId: match._id, userId: req.user._id }
          }
        ]);
      }
    }

    res.status(201).json({
      success: true,
      message: match ? "It's a match!" : 'Swipe recorded',
      data: {
        swipe,
        match
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Undo last swipe
// @route   POST /api/swipes/undo
// @access  Private (Premium feature)
export const undoSwipe = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    // Check if user has premium subscription (temporarily disabled for testing)
    // if (!currentUser.hasActiveSubscription()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Undo swipe is a premium feature. Please upgrade your subscription.'
    //   });
    // }

    // Get last swipe
    const lastSwipe = await Swipe.findOne({
      swiper: req.user._id,
      undone: false
    }).sort({ createdAt: -1 });

    if (!lastSwipe) {
      return res.status(404).json({
        success: false,
        message: 'No swipe to undo'
      });
    }

    // Mark as undone
    lastSwipe.undone = true;
    lastSwipe.undoneAt = new Date();
    await lastSwipe.save();

    res.status(200).json({
      success: true,
      message: 'Swipe undone successfully',
      data: lastSwipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get swipe history
// @route   GET /api/swipes/history
// @access  Private
export const getSwipeHistory = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    const query = {
      swiper: req.user._id,
      undone: false
    };

    if (type) {
      query.type = type;
    }

    const swipes = await Swipe.find(query)
      .populate('swiped', 'name age photos bio')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Swipe.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: swipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get who liked me (Premium feature)
// @route   GET /api/swipes/who-liked-me
// @access  Private (Premium)
export const whoLikedMe = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    // Check premium subscription (DISABLED FOR TESTING)
    // if (!currentUser.hasActiveSubscription() || 
    //     currentUser.subscription.plan === 'free') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'This is a premium feature. Please upgrade to see who liked you.'
    //   });
    // }

    const { page = 1, limit = 20 } = req.query;

    // Find users who the current user has already swiped on
    const currentUserSwipes = await Swipe.find({
      swiper: req.user._id,
      type: { $in: ['like', 'superlike'] },
      undone: false
    }).select('swiped');

    // Get IDs of users already swiped by current user
    const alreadySwipedIds = currentUserSwipes.map(swipe => swipe.swiped);

    // Find users who liked current user but haven't been liked back yet
    const likes = await Swipe.find({
      swiped: req.user._id,
      type: { $in: ['like', 'superlike'] },
      undone: false,
      swiper: { $nin: alreadySwipedIds } // Exclude users already swiped by current user
    })
    .populate('swiper', 'name age photos bio location stats')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const count = await Swipe.countDocuments({
      swiped: req.user._id,
      type: { $in: ['like', 'superlike'] },
      undone: false,
      swiper: { $nin: alreadySwipedIds }
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: likes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getPotentialMatches,
  swipeUser,
  undoSwipe,
  getSwipeHistory,
  whoLikedMe
};