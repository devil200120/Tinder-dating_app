// hooks/useMatches.js
import { useState, useEffect, useCallback } from 'react';
import { matchService } from '../services/matchService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const { socket, onEvent, offEvent } = useSocket();

  const fetchMatches = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await matchService.getMatches();
      setMatches(response.matches || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchRecentMatches = useCallback(async (limit = 10) => {
    if (!user) return;

    try {
      const response = await matchService.getRecentMatches(limit);
      setRecentMatches(response.matches || []);
    } catch (err) {
      console.error('Failed to fetch recent matches:', err);
    }
  }, [user]);

  const unmatchUser = useCallback(async (matchId) => {
    try {
      await matchService.unmatchUser(matchId);
      
      // Remove from local state
      setMatches(prev => prev.filter(match => match._id !== matchId));
      setRecentMatches(prev => prev.filter(match => match._id !== matchId));
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unmatch user');
      throw err;
    }
  }, []);

  const getMatchById = useCallback((matchId) => {
    return matches.find(match => match._id === matchId);
  }, [matches]);

  const addNewMatch = useCallback((newMatch) => {
    setMatches(prev => [newMatch, ...prev]);
    setRecentMatches(prev => [newMatch, ...prev.slice(0, 9)]);
  }, []);

  const updateMatch = useCallback((matchId, updates) => {
    setMatches(prev => 
      prev.map(match => 
        match._id === matchId 
          ? { ...match, ...updates }
          : match
      )
    );
    
    setRecentMatches(prev => 
      prev.map(match => 
        match._id === matchId 
          ? { ...match, ...updates }
          : match
      )
    );
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (socket && user) {
      // Listen for new matches
      onEvent('new_match', (matchData) => {
        addNewMatch(matchData);
      });

      // Listen for unmatches
      onEvent('user_unmatched', ({ matchId }) => {
        setMatches(prev => prev.filter(match => match._id !== matchId));
        setRecentMatches(prev => prev.filter(match => match._id !== matchId));
      });

      return () => {
        offEvent('new_match');
        offEvent('user_unmatched');
      };
    }
  }, [socket, user, onEvent, offEvent, addNewMatch]);

  // Fetch matches on mount
  useEffect(() => {
    if (user) {
      fetchMatches();
      fetchRecentMatches();
    }
  }, [user, fetchMatches, fetchRecentMatches]);

  return {
    matches,
    recentMatches,
    loading,
    error,
    fetchMatches,
    fetchRecentMatches,
    unmatchUser,
    getMatchById,
    addNewMatch,
    updateMatch,
    clearError: () => setError(null),
  };
};