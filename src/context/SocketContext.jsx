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
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      const newSocket = io(
        import.meta.env.VITE_API_URL || "http://localhost:5000",
        {
          auth: {
            token,
            userId: user._id,
          },
          transports: ["websocket"],
        }
      );

      // Connection events
      newSocket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      // Online users
      newSocket.on("online_users", (users) => {
        setOnlineUsers(users);
      });

      // User status updates
      newSocket.on("user_status_update", ({ userId, isOnline }) => {
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
        newSocket.close();
      };
    } else {
      // Cleanup socket when user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
      }
    }
  }, [user, token]);

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
