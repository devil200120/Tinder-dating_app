// services/matchService.js
import api from './api.js';

export const matchService = {
  // Get all matches
  getMatches: async () => {
    const response = await api.get('/matches');
    return response.data;
  },

  // Get match details
  getMatchDetails: async (matchId) => {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },

  // Unmatch user
  unmatchUser: async (matchId) => {
    const response = await api.delete(`/matches/${matchId}`);
    return response.data;
  },

  // Get recent matches
  getRecentMatches: async (limit = 10) => {
    const response = await api.get('/matches/recent', {
      params: { limit }
    });
    return response.data;
  },
};