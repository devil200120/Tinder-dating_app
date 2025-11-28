// context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, token, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Only connect socket when user is authenticated and not loading
    if (user && token && isAuthenticated && !loading) {
      console.log("Initializing socket connection...");

      // Initialize socket connection
      const newSocket = io(
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
        {
          auth: {
            token,
            userId: user._id || user.id,
          },
          transports: ["websocket"],
        }
      );

      // Connection events
      newSocket.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      // Online users
      newSocket.on("online_users", (users) => {
        setOnlineUsers(users);
      });

      // User status updates
      newSocket.on("user-status-update", ({ userId, isOnline, lastSeen }) => {
        console.log(`User ${userId} status update:`, { isOnline, lastSeen });
        setOnlineUsers((prev) => {
          if (isOnline) {
            return prev.includes(userId) ? prev : [...prev, userId];
          } else {
            return prev.filter((id) => id !== userId);
          }
        });
      });

      setSocket(newSocket);

      // Cleanup
      return () => {
        console.log("Cleaning up socket connection");
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
      };
    } else {
      // Cleanup socket when user logs out or is loading
      if (socket) {
        console.log("User logged out, cleaning up socket");
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
      }
    }
  }, [user, token, isAuthenticated, loading]); // Added loading to dependency array

  const emitEvent = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const onEvent = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const offEvent = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    emitEvent,
    onEvent,
    offEvent,
    isUserOnline,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
