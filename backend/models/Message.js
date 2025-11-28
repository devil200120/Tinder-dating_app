// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'voice', 'file', 'gif', 'surprise'],
    default: 'text'
  },
  mediaUrl: String,
  fileName: String,
  fileSize: Number,
  metadata: {
    duration: Number, // for voice messages
    title: String,    // for gifs
    thumbnail: String // for videos
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  deliveredTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: {
      type: String,
      enum: ['❤️', '😂', '😮', '😢', '😡', '👍', '👎']
    },
    reactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedForUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Reply functionality
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isReply: {
    type: Boolean,
    default: false
  },
  // Edit functionality
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  originalContent: String,
  // Surprise message functionality
  isSurprise: {
    type: Boolean,
    default: false
  },
  isRevealed: {
    type: Boolean,
    default: false
  },
  revealedAt: Date,
  surpriseEmoji: {
    type: String,
    default: '🎉'
  }
}, {
  timestamps: true
});

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;