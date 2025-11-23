// components/MatchCard.jsx
import React from "react";
import { MessageCircle, X, Calendar } from "lucide-react";

const MatchCard = ({ match, onClick, onUnmatch }) => {
  if (!match || !match.users || match.users.length < 2) return null;

  // Get the other user (not the current user)
  const otherUser =
    match.users.find((user) => user._id !== match.currentUserId) ||
    match.users[0];
  const photo = otherUser?.photos?.[0]?.url || "/default-avatar.png";

  const formatMatchDate = (date) => {
    const now = new Date();
    const matchDate = new Date(date);
    const diffInDays = Math.floor((now - matchDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return matchDate.toLocaleDateString();
  };

  return (
    <div
      className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
      onClick={() => onClick?.(match)}
    >
      {/* Photo */}
      <div className="aspect-square relative">
        <img
          src={photo}
          alt={otherUser?.name || "Match"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* User Info */}
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <h3 className="font-semibold text-sm truncate">{otherUser?.name}</h3>
          {otherUser?.age && (
            <p className="text-xs opacity-90">{otherUser.age} years old</p>
          )}
        </div>

        {/* Online Status */}
        {otherUser?.status?.isOnline && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}

        {/* Unmatch Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnmatch?.(match._id);
          }}
          className="absolute top-2 left-2 w-8 h-8 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Match Info */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {formatMatchDate(match.matchedAt)}
            </span>
          </div>

          {match.chat && (
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4 text-pink-500" />
              {match.unreadCount > 0 && (
                <span className="bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                  {match.unreadCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Last Message Preview */}
        {match.lastMessage && (
          <p className="text-xs text-gray-600 mt-1 truncate">
            {match.lastMessage.content}
          </p>
        )}
      </div>

      {/* New Match Badge */}
      {match.isNew && (
        <div className="absolute top-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-br-lg">
          New!
        </div>
      )}
    </div>
  );
};

export default MatchCard;
