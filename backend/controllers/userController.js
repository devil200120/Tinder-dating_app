// controllers/userController.js
import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get user profile
// @route   GET /api/users/profile/:userId
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -refreshToken -verification');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Increment profile views
    user.stats.profileViews += 1;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      bio,
      occupation,
      education,
      interests,
      genderPreference,
      preferences
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (occupation) user.occupation = occupation;
    if (education) user.education = education;
    if (interests) user.interests = interests;
    if (genderPreference) user.genderPreference = genderPreference;
    if (preferences) {
      if (preferences.ageRange) user.preferences.ageRange = preferences.ageRange;
      if (preferences.distanceRange) user.preferences.distanceRange = preferences.distanceRange;
      if (preferences.lookingFor) user.preferences.lookingFor = preferences.lookingFor;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload photos
// @route   POST /api/users/photos
// @access  Private
export const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const user = await User.findById(req.user._id);

    if (user.photos.length + req.files.length > 6) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 6 photos allowed'
      });
    }

    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file, 'dating-app/users')
    );

    const uploadedPhotos = await Promise.all(uploadPromises);

    const newPhotos = uploadedPhotos.map((photo, index) => ({
      url: photo.url,
      publicId: photo.publicId,
      isPrimary: user.photos.length === 0 && index === 0
    }));

    user.photos.push(...newPhotos);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Photos uploaded successfully',
      data: user.photos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete photo
// @route   DELETE /api/users/photos/:photoId
// @access  Private
export const deletePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const photo = user.photos.id(req.params.photoId);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(photo.publicId);

    // Remove from user
    user.photos.pull(req.params.photoId);

    // If deleted photo was primary, make first photo primary
    if (photo.isPrimary && user.photos.length > 0) {
      user.photos[0].isPrimary = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
      data: user.photos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Set primary photo
// @route   PUT /api/users/photos/:photoId/primary
// @access  Private
export const setPrimaryPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const photo = user.photos.id(req.params.photoId);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Remove primary from all photos
    user.photos.forEach(p => p.isPrimary = false);

    // Set new primary
    photo.isPrimary = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Primary photo updated',
      data: user.photos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update location
// @route   PUT /api/users/location
// @access  Private
export const updateLocation = async (req, res) => {
  try {
    const { longitude, latitude, city, country, address } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    const user = await User.findById(req.user._id);

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
      city,
      country,
      address
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: user.location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update online status
// @route   PUT /api/users/status
// @access  Private
export const updateStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;

    const user = await User.findById(req.user._id);

    user.status.isOnline = isOnline;
    user.status.lastSeen = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Status updated',
      data: user.status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Delete photos from Cloudinary
    for (const photo of user.photos) {
      await deleteFromCloudinary(photo.publicId);
    }

    // Soft delete - deactivate account
    user.isActive = false;
    user.email = `deleted_${user._id}@deleted.com`;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getUserProfile,
  updateProfile,
  uploadPhotos,
  deletePhoto,
  setPrimaryPhoto,
  updateLocation,
  updateStatus,
  deleteAccount
};