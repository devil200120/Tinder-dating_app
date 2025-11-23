// models/Subscription.js
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['premium', 'gold', 'platinum'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'google_pay', 'apple_pay'],
    default: 'card'
  },
  transactionId: String,
  features: [{
    type: String
  }],
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

subscriptionSchema.index({ user: 1, isActive: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;