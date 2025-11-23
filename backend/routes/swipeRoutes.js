// routes/swipeRoutes.js
import express from 'express';
import {
  getPotentialMatches,
  swipeUser,
  undoSwipe,
  getSwipeHistory,
  whoLikedMe
} from '../controllers/swipeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { swipeLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.get('/potential', protect, getPotentialMatches);
router.post('/', protect, swipeLimiter, swipeUser);
router.post('/undo', protect, undoSwipe);
router.get('/history', protect, getSwipeHistory);
router.get('/who-liked-me', protect, whoLikedMe);

export default router;