// routes/locationRoutes.js
import express from 'express';
import {
  updateLocation,
  getMyLocation
} from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, updateLocation);
router.get('/me', protect, getMyLocation);

export default router;