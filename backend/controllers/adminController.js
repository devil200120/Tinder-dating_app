// controllers/adminController.js
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Report from '../models/Report.js';
import Match from '../models/Match.js';
import Message from '../models/Message.js';
import Subscription from '../models/Subscription.js';
import { generateAccessToken } from '../utils/generateToken.js';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your admin account is inactive'
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateAccessToken(admin._id);

    res.status(200).json({
      success: true,
      data: {
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const premiumUsers = await User.countDocuments({ 
      'subscription.isActive': true,
      'subscription.plan': { $ne: 'free' }
    });

    const totalMatches = await Match.countDocuments({ isActive: true });
    const totalMessages = await Message.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const activeSubscriptions = await Subscription.countDocuments({ 
      isActive: true,
      endDate: { $gt: new Date() }
    });

    // Revenue calculation (mock)
    const totalRevenue = await Subscription.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLastWeek = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers,
          premium: premiumUsers,
          newThisWeek: newUsersLastWeek
        },
        matches: {
          total: totalMatches
        },
        messages: {
          total: totalMessages
        },
        reports: {
          pending: pendingReports
        },
        subscriptions: {
          active: activeSubscriptions,
          revenue: totalRevenue[0]?.total || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (status === 'banned') query.isBanned = true;

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Ban user
// @route   PUT /api/admin/users/:userId/ban
// @access  Private (Admin)
export const banUser = async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBanned = true;
    user.banReason = reason || 'Violation of terms of service';
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unban user
// @route   PUT /api/admin/users/:userId/unban
// @access  Private (Admin)
export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBanned = false;
    user.banReason = undefined;
    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User unbanned successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:userId
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    let query = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('reporter', 'name email photos')
      .populate('reportedUser', 'name email photos')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Review report
// @route   PUT /api/admin/reports/:reportId/review
// @access  Private (Admin)
export const reviewReport = async (req, res) => {
  try {
    const { status, action, actionNotes } = req.body;

    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.status = status || 'reviewing';
    report.reviewedBy = req.admin._id;
    report.reviewedAt = new Date();
    report.action = action || 'none';
    report.actionNotes = actionNotes;

    await report.save();

    // Take action if specified
    if (action === 'temporary_ban' || action === 'permanent_ban') {
      const user = await User.findById(report.reportedUser);
      if (user) {
        user.isBanned = true;
        user.banReason = `Report action: ${report.reason}`;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Report reviewed successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  getAllReports,
  reviewReport
};