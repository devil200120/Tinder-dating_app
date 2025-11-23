// routes/chatRoutes.js
import express from 'express';
import {
  getChats,
  getChat,
  markChatAsRead,
  deleteChat
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getChats);
router.get('/:chatId', protect, getChat);
router.put('/:chatId/read', protect, markChatAsRead);
router.delete('/:chatId', protect, deleteChat);

export default router;