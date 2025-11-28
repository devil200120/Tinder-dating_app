// components/LastSeenStatus.jsx
import React from "react";
import {
  formatLastSeen,
  formatLastSeenShort,
  getOnlineStatusColors,
} from "../utils/dateUtils";

const LastSeenStatus = ({
  lastSeen,
  isOnline = false,
  variant = "default", // 'default', 'short', 'dot-only'
  showDot = true,
  className = "",
}) => {
  const statusColors = getOnlineStatusColors(lastSeen, isOnline);
  const statusText =
    variant === "short"
      ? formatLastSeenShort(lastSeen, isOnline)
      : formatLastSeen(lastSeen, isOnline);

  if (variant === "dot-only") {
    return (
      <div className={`flex items-center ${className}`}>
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-500 animate-pulse" : statusColors.dot
          }`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showDot && (
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-500 animate-pulse" : statusColors.dot
          }`}
        />
      )}
      <span className={`text-sm font-medium ${statusColors.text}`}>
        {statusText}
      </span>
    </div>
  );
};

export default LastSeenStatus;
