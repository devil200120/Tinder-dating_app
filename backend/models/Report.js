// models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: [
      'inappropriate_content',
      'harassment',
      'fake_profile',
      'spam',
      'underage',
      'violence',
      'scam',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: Date,
  action: {
    type: String,
    enum: ['none', 'warning', 'temporary_ban', 'permanent_ban', 'account_deletion'],
    default: 'none'
  },
  actionNotes: String
}, {
  timestamps: true
});

reportSchema.index({ reportedUser: 1, status: 1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;