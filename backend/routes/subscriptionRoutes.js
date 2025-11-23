// routes/subscriptionRoutes.js
import express from 'express';
import {
  getPlans,
  subscribe,
  getMySubscriptions,
  getActiveSubscription,
  cancelSubscription
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/subscribe', protect, subscribe);
router.get('/my-subscriptions', protect, getMySubscriptions);
router.get('/active', protect, getActiveSubscription);
router.put('/:subscriptionId/cancel', protect, cancelSubscription);

export default router;