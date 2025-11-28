// hooks/useLastSeen.js
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to manage last seen updates and real-time status
 */
export const useLastSeen = () => {
  const { user, updateUserStatus } = useAuth();
  const [isActive, setIsActive] = useState(true);
  const lastActivityRef = useRef(Date.now());
  const updateIntervalRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);

  // Track user activity
  const updateActivity = () => {
    lastActivityRef.current = Date.now();
    
    if (!isActive) {
      setIsActive(true);
      updateUserStatus(true); // Set online
    }

    // Clear existing timeout and set new one
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    // Set user as inactive after 5 minutes of no activity
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsActive(false);
      updateUserStatus(false); // Set offline
    }, 5 * 60 * 1000); // 5 minutes
  };

  // Send periodic heartbeat when active
  const sendHeartbeat = () => {
    if (isActive && user) {
      updateUserStatus(true);
    }
  };

  useEffect(() => {
    // Activity event listeners
    const activityEvents = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Set up heartbeat interval (every 2 minutes)
    updateIntervalRef.current = setInterval(sendHeartbeat, 2 * 60 * 1000);

    // Initial activity update
    updateActivity();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [user, isActive]);

  // Update status on window focus/blur
  useEffect(() => {
    const handleFocus = () => {
      updateActivity();
    };

    const handleBlur = () => {
      // Update last seen when window loses focus
      updateUserStatus(false);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Update status on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateUserStatus(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    isActive,
    lastActivity: lastActivityRef.current,
    updateActivity
  };
};