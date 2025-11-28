// models/Block.js
import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  blocker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blocked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockType: {
    type: String,
    enum: ['complete', 'messages', 'profile'],
    default: 'complete'
  },
  reason: {
    type: String,
    enum: [
      'harassment',
      'inappropriate_content', 
      'spam',
      'fake_profile',
      'inappropriate_behavior',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

blockSchema.index({ blocker: 1, blocked: 1 }, { unique: true });
blockSchema.index({ blocker: 1 });
blockSchema.index({ blocked: 1 });
blockSchema.index({ isActive: 1 });

const Block = mongoose.model('Block', blockSchema);

export default Block;