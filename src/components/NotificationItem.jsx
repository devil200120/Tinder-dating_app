// components/NotificationItem.jsx
import React from "react";
import {
  Heart,
  MessageCircle,
  Star,
  UserPlus,
  Crown,
  Bell,
  CheckCircle,
} from "lucide-react";

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "match":
        return <Heart className="w-5 h-5 text-pink-500" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "super_like":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "subscription":
        return <Crown className="w-5 h-5 text-purple-500" />;
      case "profile_visit":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationMessage = () => {
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
        return `${
          notification.data?.userName || "Someone"
        } super liked your profile!`;
      case "subscription":
        return notification.message || "Subscription update";
      case "profile_visit":
        return `${
          notification.data?.userName || "Someone"
        } viewed your profile`;
      default:
        return notification.message || "You have a new notification";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return notificationDate.toLocaleDateString();
  };

  return (
    <div
      className={`flex items-start space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.isRead ? "bg-blue-50/50" : ""
      }`}
      onClick={() => onClick?.(notification)}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            !notification.isRead ? "font-medium text-gray-900" : "text-gray-600"
          }`}
        >
          {getNotificationMessage()}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {formatTime(notification.createdAt)}
          </span>

          <div className="flex items-center space-x-2">
            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead?.(notification._id);
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark as read
              </button>
            )}

            {notification.isRead && (
              <CheckCircle className="w-3 h-3 text-green-500" />
            )}
          </div>
        </div>
      </div>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
      )}
    </div>
  );
};

export default NotificationItem;
