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
  deleteAccount
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPhotos as uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/profile/:userId', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/photos', protect, uploadMiddleware, uploadPhotos);
router.delete('/photos/:photoId', protect, deletePhoto);
router.put('/photos/:photoId/primary', protect, setPrimaryPhoto);
router.put('/location', protect, updateLocation);
router.put('/status', protect, updateStatus);
router.delete('/account', protect, deleteAccount);

export default router;