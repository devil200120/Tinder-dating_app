// routes/boostRoutes.js
import express from 'express';
import {
  activateBoost,
  getBoostHistory,
  getActiveBoost
} from '../controllers/boostController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, activateBoost);
router.get('/history', protect, getBoostHistory);
router.get('/active', protect, getActiveBoost);

export default router;