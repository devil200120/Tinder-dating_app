// routes/reportRoutes.js
import express from 'express';
import {
  reportUser,
  getMyReports
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, reportUser);
router.get('/my-reports', protect, getMyReports);

export default router;