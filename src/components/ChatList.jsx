import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { formatTimestamp } from "../utils/helpers";
import {
  Trash2,
  MessageCircle,
  Clock,
  ChevronRight,
  MoreVertical,
  Shield,
  UserX,
} from "lucide-react";
import BlockUserModal from "./BlockUserModal";
import { userService } from "../services/userService";
import { useToast } from "../context/ToastContext";

const ChatList = ({ matches, onDeleteChat }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deletingId, setDeletingId] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleChatClick = (match) => {
    navigate(`/chats/${match._id}`);
  };

  const handleDelete = async (e, matchId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      setDeletingId(matchId);
      await onDeleteChat(matchId);
      setDeletingId(null);
    }
  };

  const handleBlockUser = (e, user) => {
    e.stopPropagation();
    setSelectedUser(user);
    setIsBlockModalOpen(true);
    setShowMoreMenu(null);
  };

  const handleUserBlocked = (blockedUser) => {
    setIsBlockModalOpen(false);
    setSelectedUser(null);
    showToast(`${selectedUser?.name} has been blocked`, "success");
    // Optionally remove the chat from the list or refresh
  };

  const toggleMoreMenu = (e, matchId) => {
    e.stopPropagation();
    setShowMoreMenu(showMoreMenu === matchId ? null : matchId);
  };

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-pink-100 dark:from-primary-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <MessageCircle className="w-10 h-10 text-primary-500 dark:text-primary-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">💖</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
          No conversations yet
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm leading-relaxed mb-6">
          Start swiping to find your perfect match and begin meaningful
          conversations!
        </p>

        <button
          onClick={() => navigate("/discover")}
          className="bg-gradient-to-r from-primary-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Start Discovering
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-dark-700/50">
      {matches.map((match, index) => {
        const isDeleting = deletingId === match._id;

        return (
          <div
            key={match._id}
            onClick={() => !isDeleting && handleChatClick(match)}
            className={`relative flex items-center p-4 sm:p-6 cursor-pointer transition-all duration-300 group ${
              isDeleting
                ? "opacity-50 pointer-events-none"
                : "hover:bg-gray-50 dark:hover:bg-dark-700/50 active:bg-gray-100 dark:active:bg-dark-700"
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
              animation: "fadeInUp 0.5s ease-out both",
            }}
          >
            {/* Avatar with Online Status */}
            <div className="relative flex-shrink-0 mr-4">
              <Avatar
                src={
                  match.user?.photos?.[0]?.url ||
                  match.user?.photos?.[0] ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    match.user?.name || "User"
                  )}&size=120&background=gradient&color=ffffff`
                }
                alt={match.user?.name || "User"}
                size="lg"
                online={match.user?.status?.isOnline}
                className="ring-2 ring-white dark:ring-dark-800 group-hover:ring-primary-200 dark:group-hover:ring-primary-800 transition-all duration-300"
              />

              {/* Unread indicator */}
              {match.unread && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full border-2 border-white dark:border-dark-800 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
              {/* Name and Time */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {match.user?.name || "Unknown User"}
                </h3>

                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">
                    {formatTimestamp(match.matchedAt || match.timestamp)}
                  </span>
                </div>
              </div>

              {/* Last Message */}
              <p
                className={`text-sm sm:text-base truncate leading-relaxed ${
                  match.unread
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {match.chat?.lastMessage?.content ||
                  match.lastMessage ||
                  "👋 Start a conversation!"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 relative">
              {/* Chevron */}
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />

              {/* More Options */}
              <button
                onClick={(e) => toggleMoreMenu(e, match._id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-all duration-200 hover:scale-110"
                title="More options"
              >
                <MoreVertical className="w-4 h-4 text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showMoreMenu === match._id && (
                <div
                  className="absolute right-0 top-10 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 min-w-[180px] py-2 backdrop-blur-xl"
                  style={{ zIndex: 9999 }}
                >
                  <button
                    onClick={(e) => handleBlockUser(e, match.user)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors flex items-center space-x-3 group/item"
                  >
                    <Shield className="w-4 h-4 text-red-500 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Block User
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Block this user completely
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-gray-200 dark:border-dark-700 my-1"></div>

                  <button
                    onClick={(e) => handleDelete(e, match._id)}
                    disabled={isDeleting}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors flex items-center space-x-3 group/item disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-500 group-hover/item:scale-110 transition-transform" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Delete Chat
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Remove this conversation
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Delete Button - Hidden but kept for backwards compatibility */}
              <button
                onClick={(e) => handleDelete(e, match._id)}
                disabled={isDeleting}
                className="hidden opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                title="Delete conversation"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                )}
              </button>
            </div>

            {/* Hover gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-50/50 to-transparent dark:via-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        );
      })}

      {/* Block User Modal */}
      <BlockUserModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        user={selectedUser}
        onUserBlocked={handleUserBlocked}
      />

      {/* Click outside to close more menu */}
      {showMoreMenu && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 9998 }}
          onClick={() => setShowMoreMenu(null)}
        />
      )}
    </div>
  );
};

// Add fadeInUp animation styles
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Inject styles
if (
  typeof document !== "undefined" &&
  !document.getElementById("chatlist-styles")
) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "chatlist-styles";
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ChatList;
