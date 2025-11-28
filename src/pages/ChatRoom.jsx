import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Info,
  Wifi,
  ChevronUp,
  ChevronDown,
  Shield,
  Flag,
  UserX,
} from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useNavbar } from "../context/NavbarContext";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import ChatBox from "../components/ChatBox";
import Avatar from "../components/Avatar";
import LastSeenStatus from "../components/LastSeenStatus";
import BlockUserModal from "../components/BlockUserModal";
import { userService } from "../services/userService";
import { useToast } from "../context/ToastContext";

const ChatRoom = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const {
    getMatchById,
    getUserById,
    getMessages,
    sendMessage,
    deleteMessage,
    editMessage,
    sendSurpriseMessage,
    revealSurpriseMessage,
    setReplyTo,
    cancelReply,
    addReaction,
    removeReaction,
    replyingTo,
    markAsRead,
    markMessageAsRead,
    startTyping,
    stopTyping,
    getTypingUsers,
  } = useChat();
  const { isNavbarVisible, toggleNavbar } = useNavbar();
  const { showToast } = useToast();
  const { socket, isConnected, emitEvent } = useSocket();
  const hasMarkedAsRead = useRef(false);

  // Block functionality state
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockStatus, setBlockStatus] = useState(null);

  // For match ID (when coming from matches page) or user ID (when coming from other places)
  const match = getMatchById(chatId);
  const user = match?.user || getUserById(chatId);
  const messages = getMessages(chatId);

  console.log("ChatRoom Debug:", { chatId, match, user, messages }); // Debug log

  useEffect(() => {
    if ((match || user) && chatId && !hasMarkedAsRead.current) {
      hasMarkedAsRead.current = true;
      markAsRead(chatId);
    }
  }, [chatId, match, user]);

  // Reset the ref when chatId changes
  useEffect(() => {
    hasMarkedAsRead.current = false;
  }, [chatId]);

  // Check block status
  useEffect(() => {
    const checkBlockStatus = async () => {
      if (user?._id) {
        try {
          const response = await userService.checkBlockStatus(user._id);
          setBlockStatus(response.data);
        } catch (error) {
          console.error("Failed to check block status:", error);
        }
      }
    };

    checkBlockStatus();
  }, [user?._id]);

  // Join/leave chat room via socket
  useEffect(() => {
    if (socket && isConnected && match?.chat?._id) {
      console.log("Joining chat room:", match.chat._id);
      emitEvent("join-chat", match.chat._id);

      return () => {
        console.log("Leaving chat room:", match.chat._id);
        emitEvent("leave-chat", match.chat._id);
      };
    }
  }, [socket, isConnected, match?.chat?._id, emitEvent]);

  if (!match || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-dark-950 dark:to-dark-900">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <span className="text-3xl">💔</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Chat not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This conversation may have been deleted or doesn't exist.
          </p>
          <button
            onClick={() => navigate("/chats")}
            className="bg-gradient-to-r from-primary-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = (
    text,
    type = "text",
    file = null,
    metadata = {}
  ) => {
    sendMessage(chatId, text, type, file, metadata);
  };

  const handleSendSurprise = (content, surpriseEmoji) => {
    sendSurpriseMessage(chatId, content, surpriseEmoji);
  };

  const handleRevealSurprise = (messageId) => {
    revealSurpriseMessage(messageId);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${user?._id}`, { state: { user } });
    setShowMoreMenu(false);
  };

  const handleUserBlocked = (blockedUser) => {
    setBlockStatus({ isBlocked: true, blockedBy: "you" });
    setIsBlockModalOpen(false);
    setShowMoreMenu(false);
    showToast(`${user?.name} has been blocked`, "success");
    // Optionally navigate back to chats after blocking
    setTimeout(() => {
      navigate("/chats");
    }, 1000);
  };

  const handleReportUser = () => {
    setShowMoreMenu(false);
    showToast("Report functionality coming soon", "info");
  };

  const handleTypingStart = () => {
    if (chatId) {
      startTyping(chatId);
    }
  };

  const handleTypingStop = () => {
    if (chatId) {
      stopTyping(chatId);
    }
  };

  const typingUsers = chatId ? getTypingUsers(chatId) : [];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 relative">
      {/* Navbar Toggle Button - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleNavbar}
          className="bg-white/95 dark:bg-dark-800/95 backdrop-blur-lg border border-gray-300/50 dark:border-dark-600/50 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 group flex items-center justify-center"
          title={isNavbarVisible ? "Hide navigation" : "Show navigation"}
        >
          {isNavbarVisible ? (
            <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-500" />
          )}
        </button>
      </div>

      {/* Enhanced Header - Moves up when navbar is hidden */}
      <div
        className={`bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-700/50 px-4 sm:px-6 py-3 shadow-lg transition-all duration-700 ease-out transform ${
          isNavbarVisible ? "" : "fixed top-0 left-0 right-0 z-40"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => navigate("/chats")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700/50 rounded-xl transition-all duration-200 hover:scale-105 group"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary-500" />
            </button>

            <div
              onClick={handleViewProfile}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700/30 rounded-xl p-2 -ml-2 transition-all duration-200 group"
            >
              <div className="relative">
                <Avatar
                  src={
                    user?.photos?.[0]?.url ||
                    user?.photos?.[0] ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}&size=120&background=gradient&color=ffffff`
                  }
                  alt={user?.name || "User"}
                  size="md"
                  online={user?.status?.isOnline}
                  className="ring-2 ring-white dark:ring-dark-800 group-hover:ring-primary-200 dark:group-hover:ring-primary-800 transition-all duration-300"
                />
                {/* Block status indicator */}
                {blockStatus?.isBlocked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-dark-800 flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
                {/* Active status pulse */}
                {user?.status?.isOnline && !blockStatus?.isBlocked && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-dark-800 flex items-center justify-center">
                    <Wifi className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {user?.name || "Unknown User"}
                  </h2>
                  {blockStatus?.isBlocked && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
                      Blocked
                    </span>
                  )}
                </div>
                <LastSeenStatus
                  lastSeen={user?.status?.lastSeen}
                  isOnline={user?.status?.isOnline}
                  variant="short"
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Quick actions */}
            <button
              className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-dark-700/50 rounded-xl transition-all duration-200 hover:scale-110 group hover:shadow-lg"
              title="Voice call"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-hover:scale-110 transition-transform" />
            </button>
            <button
              className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-dark-700/50 rounded-xl transition-all duration-200 hover:scale-110 group hover:shadow-lg"
              title="Video call"
            >
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleViewProfile}
              className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-dark-700/50 rounded-xl transition-all duration-200 hover:scale-110 group hover:shadow-lg"
              title="View profile"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 group-hover:scale-110 transition-transform" />
            </button>

            {/* More options dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-dark-700/50 rounded-xl transition-all duration-200 hover:scale-110 group"
                title="More options"
              >
                <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:scale-110 transition-transform" />
              </button>

              {/* Dropdown menu */}
              {showMoreMenu && (
                <div
                  className="absolute right-0 top-12 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 min-w-[200px] py-2 backdrop-blur-xl"
                  style={{ zIndex: 9999 }}
                >
                  <button
                    onClick={() => setIsBlockModalOpen(true)}
                    disabled={blockStatus?.isBlocked}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Shield className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {blockStatus?.isBlocked ? "User Blocked" : "Block User"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {blockStatus?.isBlocked
                          ? "This user is already blocked"
                          : "Block this user from contacting you"}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleReportUser}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors flex items-center space-x-3 group"
                  >
                    <Flag className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Report User
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Report inappropriate behavior
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-gray-200 dark:border-dark-700 my-1"></div>

                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      navigate("/chats");
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors flex items-center space-x-3 group"
                  >
                    <UserX className="w-4 h-4 text-gray-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Leave Chat
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Return to chats list
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Box with improved styling */}
      <div
        className={`flex-1 overflow-hidden relative transition-all duration-700 ease-out ${
          isNavbarVisible ? "" : "pt-20"
        }`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-pink-50/30 dark:from-primary-900/10 dark:to-pink-900/10" />
        </div>

        <div className="max-w-6xl mx-auto h-full relative z-10">
          <ChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            onSendSurprise={handleSendSurprise}
            onRevealSurprise={handleRevealSurprise}
            onMarkAsRead={markMessageAsRead}
            onDeleteMessage={deleteMessage}
            onReplyMessage={setReplyTo}
            onEditMessage={editMessage}
            onAddReaction={addReaction}
            onRemoveReaction={removeReaction}
            replyingTo={replyingTo}
            onCancelReply={cancelReply}
            onBlockUser={() => setIsBlockModalOpen(true)}
            recipientId={user?._id}
            currentUserId={currentUser?._id}
            isBlocked={blockStatus?.isBlocked}
            recipientAvatar={
              user?.photos?.[0]?.url ||
              user?.photos?.[0] ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&size=120&background=gradient&color=ffffff`
            }
            recipientName={user?.name || "Unknown User"}
            isNavbarHidden={!isNavbarVisible}
            isTyping={typingUsers.length > 0}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
          />
        </div>
      </div>

      {/* Block User Modal */}
      <BlockUserModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        user={user}
        onUserBlocked={handleUserBlocked}
      />

      {/* Click outside to close more menu */}
      {showMoreMenu && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 9998 }}
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </div>
  );
};

export default ChatRoom;
