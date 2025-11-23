// controllers/locationController.js
import Location from '../models/Location.js';
import User from '../models/User.js';

// @desc    Update location
// @route   POST /api/locations
// @access  Private
export const updateLocation = async (req, res) => {
  try {
    const { longitude, latitude, city, country, address, accuracy } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    // Update or create location
    let location = await Location.findOne({ user: req.user._id });

    if (location) {
      location.location.coordinates = [longitude, latitude];
      location.city = city;
      location.country = country;
      location.address = address;
      location.accuracy = accuracy;
      location.updatedAt = new Date();
      await location.save();
    } else {
      location = await Location.create({
        user: req.user._id,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        city,
        country,
        address,
        accuracy
      });
    }

    // Update user location
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
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my location
// @route   GET /api/locations/me
// @access  Private
export const getMyLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  updateLocation,
  getMyLocation
};