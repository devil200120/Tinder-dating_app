// routes/messageRoutes.js
import express from 'express';
import {
  getMessages,
  sendMessage,
  deleteMessage,
  reactToMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { messageLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.get('/:chatId', protect, getMessages);
router.post('/', protect, messageLimiter, sendMessage);
router.delete('/:messageId', protect, deleteMessage);
router.post('/:messageId/react', protect, reactToMessage);

export default router;