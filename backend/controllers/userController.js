// controllers/userController.js
import User from '../models/User.js';
import Swipe from '../models/Swipe.js';
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
      age,
      gender,
      bio,
      occupation,
      education,
      interests,
      genderPreference,
      preferences,
      location
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
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
    if (occupation) user.occupation = occupation;
    if (education) user.education = education;
    if (interests) user.interests = interests;
    if (genderPreference) user.genderPreference = genderPreference;
    if (location) {
      if (location.city) user.location.city = location.city;
      if (location.country) user.location.country = location.country;
      if (location.address) user.location.address = location.address;
      if (location.area) user.location.area = location.area;
      if (location.mainCity) user.location.mainCity = location.mainCity;
      if (location.state) user.location.state = location.state;
      if (location.coordinates && Array.isArray(location.coordinates)) {
        user.location.coordinates = location.coordinates;
      }
      if (location.placeId) user.location.placeId = location.placeId;
    }
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

// @desc    Get discover users
// @route   GET /api/users/discover
// @access  Private
export const getDiscoverUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get users already swiped by current user
    const alreadySwiped = await Swipe.find({
      user: req.user._id
    }).select('swipedUser');
    
    const swipedUserIds = alreadySwiped.map(swipe => swipe.swipedUser);

    // Get blocked users (both who current user blocked and who blocked current user)
    const Block = (await import('../models/Block.js')).default;
    const blockedUsers = await Block.find({
      $or: [
        { blocker: req.user._id, isActive: true },
        { blocked: req.user._id, isActive: true }
      ]
    }).select('blocker blocked');
    
    const blockedUserIds = blockedUsers.map(block => 
      block.blocker.toString() === req.user._id.toString() 
        ? block.blocked.toString() 
        : block.blocker.toString()
    );

    // Get user's preferences
    const {
      ageRange = { min: 18, max: 100 },
      distanceRange = 50,
      lookingFor
    } = currentUser.preferences;

    // Build query to find potential matches
    const query = {
      _id: { 
        $ne: req.user._id, // Exclude current user
        $nin: [...swipedUserIds, ...blockedUserIds] // Exclude swiped and blocked users
      },
      age: { $gte: ageRange.min, $lte: ageRange.max }, // Age filter
      // Add gender preference filtering if needed
      ...(currentUser.genderPreference?.length > 0 && 
          !currentUser.genderPreference.includes('everyone') && {
        gender: { $in: currentUser.genderPreference }
      })
    };

    const users = await User.find(query)
      .select('-password -refreshToken -verification -email')
      .limit(20) // Limit to 20 users for performance
      .sort({ createdAt: -1 }); // Show newest users first

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching discover users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// @desc    Update user online status
// @route   PUT /api/users/status
// @access  Private
export const updateUserStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'status.isOnline': isOnline,
        'status.lastSeen': new Date()
      },
      { new: true }
    ).select('_id name status');

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's last seen and online status
// @route   GET /api/users/:id/status
// @access  Private
export const getUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('_id name status')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};