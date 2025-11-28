// components/LastSeenTracker.jsx
import { useEffect } from "react";
import { useLastSeen } from "../hooks/useLastSeen";
import { useAuth } from "../context/AuthContext";

const LastSeenTracker = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isActive, updateActivity } = useLastSeen();

  useEffect(() => {
    if (isAuthenticated) {
      // Initial activity update when component mounts
      updateActivity();
    }
  }, [isAuthenticated, updateActivity]);

  return children;
};

export default LastSeenTracker;
