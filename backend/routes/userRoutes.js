// routes/userRoutes.js
import express from 'express';
import {
  getUserProfile,
  updateProfile,
  uploadPhotos,
  deletePhoto,
  setPrimaryPhoto,
  updateLocation,
  updateStatus,
  deleteAccount,
  getDiscoverUsers,
  updateUserStatus,
  getUserStatus
} from '../controllers/userController.js';
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
  checkBlockStatus,
  getBlockReasons,
  getUsersWhoBlockedMe
} from '../controllers/blockController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPhotos as uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/discover', protect, getDiscoverUsers);
router.get('/profile/:userId', protect, getUserProfile);
router.get('/:id/status', protect, getUserStatus);
router.get('/blocks', protect, getBlockedUsers);
router.get('/blocks/reasons', protect, getBlockReasons);
router.get('/blocks/blocked-by', protect, getUsersWhoBlockedMe);
router.get('/blocks/:userId/status', protect, checkBlockStatus);
router.post('/blocks/:userId', protect, blockUser);
router.delete('/blocks/:userId', protect, unblockUser);
router.put('/profile', protect, updateProfile);
router.post('/photos', protect, uploadMiddleware, uploadPhotos);
router.delete('/photos/:photoId', protect, deletePhoto);
router.put('/photos/:photoId/primary', protect, setPrimaryPhoto);
router.put('/location', protect, updateLocation);
router.put('/status', protect, updateUserStatus);
router.delete('/account', protect, deleteAccount);

export default router;