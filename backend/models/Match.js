// models/Match.js
import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  matchedAt: {
    type: Date,
    default: Date.now
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unmatchedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  unmatchedAt: Date
}, {
  timestamps: true
});

// Ensure users array has exactly 2 users
matchSchema.pre('save', function(next) {
  if (this.users.length !== 2) {
    return next(new Error('A match must have exactly 2 users'));
  }
  next();
});

// Index for faster lookups
matchSchema.index({ users: 1 });
matchSchema.index({ isActive: 1 });
matchSchema.index({ matchedAt: -1 });

const Match = mongoose.model('Match', matchSchema);

export default Match;