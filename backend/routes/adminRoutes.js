// routes/adminRoutes.js
import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  getAllReports,
  reviewReport
} from '../controllers/adminController.js';
import { adminProtect, checkPermission } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/stats', adminProtect, getDashboardStats);
router.get('/users', adminProtect, checkPermission('users'), getAllUsers);
router.put('/users/:userId/ban', adminProtect, checkPermission('users'), banUser);
router.put('/users/:userId/unban', adminProtect, checkPermission('users'), unbanUser);
router.delete('/users/:userId', adminProtect, checkPermission('users'), deleteUser);
router.get('/reports', adminProtect, checkPermission('reports'), getAllReports);
router.put('/reports/:reportId/review', adminProtect, checkPermission('reports'), reviewReport);

export default router;