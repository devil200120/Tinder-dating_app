// middleware/adminMiddleware.js
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const adminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin not found'
        });
      }

      if (!req.admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Admin account is inactive'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (req.admin.role === 'super_admin' || 
        req.admin.permissions.includes('all') ||
        req.admin.permissions.includes(permission)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: `You don't have permission to access ${permission}`
      });
    }
  };
};

export default { adminProtect, checkPermission };