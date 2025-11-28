// utils/dateUtils.js
import { format, formatDistanceToNow, isToday, isYesterday, isSameWeek } from 'date-fns';

/**
 * Format last seen timestamp into human readable format
 * @param {Date|string} lastSeen - Last seen timestamp
 * @param {boolean} isOnline - Current online status
 * @returns {string} Formatted last seen text
 */
export const formatLastSeen = (lastSeen, isOnline = false) => {
  if (isOnline) {
    return 'Online now';
  }

  if (!lastSeen) {
    return 'Last seen long ago';
  }

  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffInMinutes = (now - lastSeenDate) / (1000 * 60);

  // Less than 1 minute ago
  if (diffInMinutes < 1) {
    return 'Last seen just now';
  }

  // Less than 1 hour ago
  if (diffInMinutes < 60) {
    const minutes = Math.floor(diffInMinutes);
    return `Last seen ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  // Less than 24 hours ago (today)
  if (isToday(lastSeenDate)) {
    return `Last seen today at ${format(lastSeenDate, 'HH:mm')}`;
  }

  // Yesterday
  if (isYesterday(lastSeenDate)) {
    return `Last seen yesterday at ${format(lastSeenDate, 'HH:mm')}`;
  }

  // Within this week
  if (isSameWeek(lastSeenDate, now)) {
    return `Last seen ${format(lastSeenDate, 'EEEE')} at ${format(lastSeenDate, 'HH:mm')}`;
  }

  // More than a week ago
  const diffInDays = Math.floor(diffInMinutes / (60 * 24));
  if (diffInDays < 30) {
    return `Last seen ${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  // More than a month ago
  if (diffInDays < 365) {
    return `Last seen ${format(lastSeenDate, 'MMM dd')}`;
  }

  // More than a year ago
  return `Last seen ${format(lastSeenDate, 'MMM dd, yyyy')}`;
};

/**
 * Get relative time for last seen (short format)
 * @param {Date|string} lastSeen - Last seen timestamp
 * @param {boolean} isOnline - Current online status
 * @returns {string} Short format last seen
 */
export const formatLastSeenShort = (lastSeen, isOnline = false) => {
  if (isOnline) {
    return 'Online';
  }

  if (!lastSeen) {
    return 'Long ago';
  }

  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffInMinutes = (now - lastSeenDate) / (1000 * 60);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
  
  return format(lastSeenDate, 'MMM dd');
};

/**
 * Check if user was recently active (within last 5 minutes)
 * @param {Date|string} lastSeen - Last seen timestamp
 * @param {boolean} isOnline - Current online status
 * @returns {boolean} True if recently active
 */
export const isRecentlyActive = (lastSeen, isOnline = false) => {
  if (isOnline) return true;
  
  if (!lastSeen) return false;
  
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffInMinutes = (now - lastSeenDate) / (1000 * 60);
  
  return diffInMinutes < 5;
};

/**
 * Get online status color based on last seen
 * @param {Date|string} lastSeen - Last seen timestamp
 * @param {boolean} isOnline - Current online status
 * @returns {object} Status colors
 */
export const getOnlineStatusColors = (lastSeen, isOnline = false) => {
  if (isOnline) {
    return {
      dot: 'bg-green-500',
      text: 'text-green-600 dark:text-green-400',
      ring: 'ring-green-200 dark:ring-green-800'
    };
  }

  if (isRecentlyActive(lastSeen, isOnline)) {
    return {
      dot: 'bg-yellow-500',
      text: 'text-yellow-600 dark:text-yellow-400',
      ring: 'ring-yellow-200 dark:ring-yellow-800'
    };
  }

  return {
    dot: 'bg-gray-400 dark:bg-gray-600',
    text: 'text-gray-500 dark:text-gray-400',
    ring: 'ring-gray-200 dark:ring-gray-700'
  };
};