// context/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { notificationService } from "../services/notificationService";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);

  const { socket, onEvent, offEvent } = useSocket();
  const { user } = useAuth();

  // Request notification permission
  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    }
    return false;
  };

  // Show browser notification
  const showBrowserNotification = (title, options = {}) => {
    if (permission === "granted") {
      new Notification(title, {
        icon: "/logo.png",
        badge: "/logo.png",
        tag: "dating-app",
        ...options,
      });
    }
  };

  // Fetch notifications
  const fetchNotifications = async (page = 1, limit = 50) => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(page, limit);

      if (page === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications((prev) => [...prev, ...response.notifications]);
      }

      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);

      setNotifications((prev) => {
        const notification = prev.find((n) => n._id === notificationId);
        const newNotifications = prev.filter((n) => n._id !== notificationId);

        if (notification && !notification.isRead) {
          setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
        }

        return newNotifications;
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Add new notification
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);

    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }

    // Show browser notification for important types
    const importantTypes = ["match", "message", "super_like"];
    if (importantTypes.includes(notification.type)) {
      const title = getNotificationTitle(notification);
      const body = getNotificationBody(notification);

      showBrowserNotification(title, {
        body,
        data: { notificationId: notification._id },
      });
    }
  };

  // Get notification title for browser notification
  const getNotificationTitle = (notification) => {
    switch (notification.type) {
      case "match":
        return "💕 New Match!";
      case "message":
        return "💬 New Message";
      case "like":
        return "❤️ Someone Liked You!";
      case "super_like":
        return "⭐ Super Like!";
      default:
        return "LoveConnect";
    }
  };

  // Get notification body for browser notification
  const getNotificationBody = (notification) => {
    switch (notification.type) {
      case "match":
        return `You have a new match with ${
          notification.data?.userName || "someone"
        }!`;
      case "message":
        return `${notification.data?.userName || "Someone"} sent you a message`;
      case "like":
        return `${notification.data?.userName || "Someone"} liked your profile`;
      case "super_like":
        return `${notification.data?.userName || "Someone"} super liked you!`;
      default:
        return notification.message || "You have a new notification";
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (socket && user) {
      // Listen for new notifications
      onEvent("new_notification", addNotification);

      // Listen for notification updates
      onEvent("notification_read", ({ notificationId }) => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      });

      return () => {
        offEvent("new_notification");
        offEvent("notification_read");
      };
    }
  }, [socket, user, onEvent, offEvent]);

  // Fetch notifications on mount
  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Fetch unread count
      notificationService
        .getUnreadCount()
        .then((response) => setUnreadCount(response.count))
        .catch(console.error);
    }
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    loading,
    permission,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    requestPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
