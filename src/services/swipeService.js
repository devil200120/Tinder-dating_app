// services/swipeService.js
import api from './api.js';

export const swipeService = {
  // Swipe on user
  swipeUser: async (userId, action) => {
    const response = await api.post('/swipes', {
      swipedUser: userId,
      action, // 'like', 'dislike', 'super_like'
    });
    return response.data;
  },

  // Get swipe history
  getSwipeHistory: async (limit = 50) => {
    const response = await api.get('/swipes/history', {
      params: { limit }
    });
    return response.data;
  },

  // Undo last swipe
  undoLastSwipe: async () => {
    const response = await api.post('/swipes/undo');
    return response.data;
  },

  // Get who liked me
  getWhoLikedMe: async () => {
    const response = await api.get('/swipes/likes');
    return response.data;
  },
};