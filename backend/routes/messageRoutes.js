// routes/messageRoutes.js
import express from 'express';
import {
  getMessages,
  sendMessage,
  deleteMessage,
  reactToMessage,
  removeReactionFromMessage,
  editMessage,
  revealSurpriseMessage,
  markMessageAsRead,
  uploadMessageFile
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { messageLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.get('/:chatId', protect, getMessages);
router.post('/', protect, messageLimiter, uploadMessageFile, sendMessage);
router.put('/:messageId', protect, editMessage);
router.delete('/:messageId', protect, deleteMessage);
router.post('/:messageId/react', protect, reactToMessage);
router.delete('/:messageId/react', protect, removeReactionFromMessage);
router.post('/:messageId/reveal', protect, revealSurpriseMessage);
router.post('/:messageId/read', protect, markMessageAsRead);

export default router;