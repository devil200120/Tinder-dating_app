// utils/distanceCalculator.js
/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Number} lat1 - Latitude of first point
 * @param {Number} lon1 - Longitude of first point
 * @param {Number} lat2 - Latitude of second point
 * @param {Number} lon2 - Longitude of second point
 * @returns {Number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * 
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * 
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Get users within a certain radius using MongoDB geospatial query
 * @param {Number} longitude - User's longitude
 * @param {Number} latitude - User's latitude
 * @param {Number} maxDistance - Maximum distance in meters
 * @returns {Object} MongoDB query object
 */
export const getNearbyUsersQuery = (longitude, latitude, maxDistance) => {
  // Convert km to meters
  const maxDistanceInMeters = maxDistance * 1000;
  
  return {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistanceInMeters
      }
    }
  };
};

export default {
  calculateDistance,
  getNearbyUsersQuery
};