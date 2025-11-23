// hooks/useSwipe.js
import { useState, useCallback } from 'react';
import { swipeService } from '../services/swipeService';
import { useAuth } from '../context/AuthContext';

export const useSwipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const swipeUser = useCallback(async (userId, action) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await swipeService.swipeUser(userId, action);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to swipe');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const undoLastSwipe = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await swipeService.undoLastSwipe();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to undo swipe');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getSwipeHistory = useCallback(async (limit = 50) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await swipeService.getSwipeHistory(limit);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get swipe history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getWhoLikedMe = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await swipeService.getWhoLikedMe();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get likes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    swipeUser,
    undoLastSwipe,
    getSwipeHistory,
    getWhoLikedMe,
    loading,
    error,
    clearError: () => setError(null),
  };
};