// services/userService.js
import api from './api.js';

export const userService = {
  // Get user profile
  getProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Upload photos
  uploadPhotos: async (photos) => {
    const formData = new FormData();
    photos.forEach((photo, index) => {
      formData.append('photos', photo);
    });
    
    const response = await api.post('/users/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete photo
  deletePhoto: async (photoId) => {
    const response = await api.delete(`/users/photos/${photoId}`);
    return response.data;
  },

  // Set primary photo
  setPrimaryPhoto: async (photoId) => {
    const response = await api.put(`/users/photos/${photoId}/primary`);
    return response.data;
  },

  // Update location
  updateLocation: async (locationData) => {
    const response = await api.put('/users/location', locationData);
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
  },

  // Get discover users
  getDiscoverUsers: async (params = {}) => {
    const response = await api.get('/users/discover', { params });
    return response.data;
  },

  // Block user
  blockUser: async (userId) => {
    const response = await api.post(`/users/block/${userId}`);
    return response.data;
  },

  // Unblock user
  unblockUser: async (userId) => {
    const response = await api.delete(`/users/block/${userId}`);
    return response.data;
  },

  // Get blocked users
  getBlockedUsers: async () => {
    const response = await api.get('/users/blocked');
    return response.data;
  },

  // Report user
  reportUser: async (userId, reason, description) => {
    const response = await api.post('/reports', {
      reportedUser: userId,
      reason,
      description,
    });
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },
};