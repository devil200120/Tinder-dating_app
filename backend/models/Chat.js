// models/Chat.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
    unique: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

chatSchema.index({ match: 1 });
chatSchema.index({ participants: 1 });
chatSchema.index({ lastMessageAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;