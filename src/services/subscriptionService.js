// services/subscriptionService.js
import api from './api.js';

export const subscriptionService = {
  // Get subscription plans
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },

  // Get current subscription
  getCurrentSubscription: async () => {
    const response = await api.get('/subscriptions/current');
    return response.data;
  },

  // Subscribe to plan
  subscribeToPlan: async (planId, paymentMethod) => {
    const response = await api.post('/subscriptions/subscribe', {
      planId,
      paymentMethod,
    });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  },

  // Get subscription history
  getSubscriptionHistory: async () => {
    const response = await api.get('/subscriptions/history');
    return response.data;
  },
};