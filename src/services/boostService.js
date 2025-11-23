// services/boostService.js
import api from './api.js';

export const boostService = {
  // Get boost plans
  getBoostPlans: async () => {
    const response = await api.get('/boosts/plans');
    return response.data;
  },

  // Purchase boost
  purchaseBoost: async (planId, paymentMethod) => {
    const response = await api.post('/boosts/purchase', {
      planId,
      paymentMethod,
    });
    return response.data;
  },

  // Activate boost
  activateBoost: async () => {
    const response = await api.post('/boosts/activate');
    return response.data;
  },

  // Get boost status
  getBoostStatus: async () => {
    const response = await api.get('/boosts/status');
    return response.data;
  },

  // Get boost history
  getBoostHistory: async () => {
    const response = await api.get('/boosts/history');
    return response.data;
  },
};