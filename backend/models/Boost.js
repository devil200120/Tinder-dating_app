// models/Boost.js
import mongoose from 'mongoose';

const boostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['profile', 'super_boost'],
    default: 'profile'
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

boostSchema.index({ user: 1, isActive: 1 });
boostSchema.index({ endTime: 1 });

const Boost = mongoose.model('Boost', boostSchema);

export default Boost;