// models/Swipe.js
import mongoose from 'mongoose';

const swipeSchema = new mongoose.Schema({
  swiper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  swiped: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'dislike', 'superlike'],
    required: true
  },
  undone: {
    type: Boolean,
    default: false
  },
  undoneAt: Date
}, {
  timestamps: true
});

// Compound index to prevent duplicate swipes
swipeSchema.index({ swiper: 1, swiped: 1 }, { unique: true });
swipeSchema.index({ swiper: 1, type: 1 });
swipeSchema.index({ swiped: 1, type: 1 });
swipeSchema.index({ createdAt: -1 });

const Swipe = mongoose.model('Swipe', swipeSchema);

export default Swipe;