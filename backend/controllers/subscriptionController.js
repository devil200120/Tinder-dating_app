// controllers/subscriptionController.js
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

// Subscription plans
const SUBSCRIPTION_PLANS = {
  premium: {
    monthly: { price: 9.99, duration: 30 },
    yearly: { price: 99.99, duration: 365 }
  },
  gold: {
    monthly: { price: 19.99, duration: 30 },
    yearly: { price: 199.99, duration: 365 }
  },
  platinum: {
    monthly: { price: 29.99, duration: 30 },
    yearly: { price: 299.99, duration: 365 }
  }
};

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
export const getPlans = async (req, res) => {
  try {
    const plans = {
      free: {
        name: 'Free',
        price: 0,
        features: [
          'Limited swipes per day (50)',
          'Basic profile',
          'Match with others',
          'Send messages'
        ]
      },
      premium: {
        name: 'Premium',
        monthly: SUBSCRIPTION_PLANS.premium.monthly.price,
        yearly: SUBSCRIPTION_PLANS.premium.yearly.price,
        features: [
          'Unlimited swipes',
          'See who liked you',
          'Undo swipes',
          '5 Super Likes per week',
          'No ads'
        ]
      },
      gold: {
        name: 'Gold',
        monthly: SUBSCRIPTION_PLANS.gold.monthly.price,
        yearly: SUBSCRIPTION_PLANS.gold.yearly.price,
        features: [
          'All Premium features',
          'Profile boost once per month',
          'Control who sees you',
          'Message before matching',
          'Priority customer support'
        ]
      },
      platinum: {
        name: 'Platinum',
        monthly: SUBSCRIPTION_PLANS.platinum.monthly.price,
        yearly: SUBSCRIPTION_PLANS.platinum.yearly.price,
        features: [
          'All Gold features',
          'Profile boost twice per month',
          'See likes before matching',
          'Priority in recommendations',
          'Exclusive badges'
        ]
      }
    };

    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Subscribe to a plan
// @route   POST /api/subscriptions/subscribe
// @access  Private
export const subscribe = async (req, res) => {
  try {
    const { plan, billingCycle, paymentMethod } = req.body;

    if (!plan || !billingCycle) {
      return res.status(400).json({
        success: false,
        message: 'Plan and billing cycle are required'
      });
    }

    if (!['premium', 'gold', 'platinum'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan'
      });
    }

    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid billing cycle'
      });
    }

    // Get plan details
    const planDetails = SUBSCRIPTION_PLANS[plan][billingCycle];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planDetails.duration);

    // Mock payment processing
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create subscription
    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      price: planDetails.price,
      billingCycle,
      startDate,
      endDate,
      isActive: true,
      paymentMethod: paymentMethod || 'card',
      transactionId,
      features: getSubscriptionFeatures(plan)
    });

    // Update user subscription
    const user = await User.findById(req.user._id);
    user.subscription = {
      plan,
      startDate,
      endDate,
      isActive: true
    };
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Subscription activated successfully',
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user subscriptions
// @route   GET /api/subscriptions/my-subscriptions
// @access  Private
export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active subscription
// @route   GET /api/subscriptions/active
// @access  Private
export const getActiveSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      isActive: true,
      endDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/:subscriptionId/cancel
// @access  Private
export const cancelSubscription = async (req, res) => {
  try {
    const { reason } = req.body;

    const subscription = await Subscription.findById(req.params.subscriptionId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    subscription.autoRenew = false;
    subscription.cancelledAt = new Date();
    subscription.cancelReason = reason;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled. You can continue using premium features until the end of your billing period.',
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to get features
const getSubscriptionFeatures = (plan) => {
  const features = {
    premium: [
      'unlimited_swipes',
      'see_who_liked',
      'undo_swipes',
      'super_likes_5',
      'no_ads'
    ],
    gold: [
      'unlimited_swipes',
      'see_who_liked',
      'undo_swipes',
      'super_likes_10',
      'no_ads',
      'profile_boost_monthly',
      'control_visibility',
      'message_before_match'
    ],
    platinum: [
      'unlimited_swipes',
      'see_who_liked',
      'undo_swipes',
      'super_likes_unlimited',
      'no_ads',
      'profile_boost_twice_monthly',
      'control_visibility',
      'message_before_match',
      'priority_recommendations',
      'exclusive_badges'
    ]
  };

  return features[plan] || [];
};

export default {
  getPlans,
  subscribe,
  getMySubscriptions,
  getActiveSubscription,
  cancelSubscription
};