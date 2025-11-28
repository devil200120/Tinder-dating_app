// services/swipeService.js
import api from './api.js';

export const swipeService = {
  // Swipe on user
  swipeUser: async (userId, type) => {
    const response = await api.post('/swipes', {
      swipedUserId: userId,
      type, // 'like', 'dislike', 'superlike'
    });
    return response.data;
  },

  // Get swipe history
  getSwipeHistory: async (type = null, limit = 50) => {
    const params = { limit };
    if (type) {
      params.type = type;
    }
    const response = await api.get('/swipes/history', { params });
    return response.data;
  },

  // Undo last swipe
  undoLastSwipe: async () => {
    const response = await api.post('/swipes/undo');
    return response.data;
  },

  // Get who liked me
  getWhoLikedMe: async () => {
    const response = await api.get('/swipes/who-liked-me');
    return response.data;
  },
};