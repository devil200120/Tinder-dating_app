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

  // Block user completely
  blockUser: async (userId, reason, description, blockType = 'complete') => {
    const response = await api.post(`/users/blocks/${userId}`, {
      reason,
      description,
      blockType
    });
    return response.data;
  },

  // Unblock user
  unblockUser: async (userId) => {
    const response = await api.delete(`/users/blocks/${userId}`);
    return response.data;
  },

  // Get blocked users
  getBlockedUsers: async (page = 1, limit = 20) => {
    const response = await api.get('/users/blocks', {
      params: { page, limit }
    });
    return response.data;
  },

  // Check block status
  checkBlockStatus: async (userId) => {
    const response = await api.get(`/users/blocks/${userId}/status`);
    return response.data;
  },

  // Get block reasons
  getBlockReasons: async () => {
    const response = await api.get('/users/blocks/reasons');
    return response.data;
  },

  // Get users who blocked me
  getUsersWhoBlockedMe: async () => {
    const response = await api.get('/users/blocks/blocked-by');
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

  // Update user status (online/offline)
  updateUserStatus: async (isOnline) => {
    const response = await api.put('/users/status', { isOnline });
    return response.data;
  },

  // Get user status
  getUserStatus: async (userId) => {
    const response = await api.get(`/users/${userId}/status`);
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },
};