// routes/matchRoutes.js
import express from 'express';
import {
  getMatches,
  getMatch,
  unmatch
} from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMatches);
router.get('/:matchId', protect, getMatch);
router.delete('/:matchId', protect, unmatch);

export default router;