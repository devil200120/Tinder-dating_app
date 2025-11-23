// controllers/reportController.js
import Report from '../models/Report.js';
import User from '../models/User.js';

// @desc    Report a user
// @route   POST /api/reports
// @access  Private
export const reportUser = async (req, res) => {
  try {
    const { reportedUserId, reason, description } = req.body;

    if (!reportedUserId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if reported user exists
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already reported
    const existingReport = await Report.findOne({
      reporter: req.user._id,
      reportedUser: reportedUserId,
      status: { $in: ['pending', 'reviewing'] }
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this user'
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser: reportedUserId,
      reason,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. We will review it shortly.',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my reports
// @route   GET /api/reports/my-reports
// @access  Private
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .populate('reportedUser', 'name photos')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  reportUser,
  getMyReports
};