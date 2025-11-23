// middleware/rateLimitMiddleware.js
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  skipSuccessfulRequests: true
});

// Swipe rate limiter
export const swipeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 swipes per hour for free users
  message: {
    success: false,
    message: 'Swipe limit reached. Upgrade to premium for unlimited swipes'
  },
  skip: (req) => {
    // Skip rate limit for premium users
    return req.user && req.user.hasActiveSubscription();
  }
});

// Message rate limiter
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 messages per minute
  message: {
    success: false,
    message: 'Too many messages sent, please slow down'
  }
});

export default {
  apiLimiter,
  authLimiter,
  swipeLimiter,
  messageLimiter
};