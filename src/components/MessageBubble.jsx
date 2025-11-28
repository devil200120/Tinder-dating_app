import React, { useState, useEffect, useRef } from "react";
import { formatMessageTime } from "../utils/helpers";
import {
  Check,
  CheckCheck,
  Download,
  Play,
  Pause,
  Volume2,
  MoreVertical,
  Trash2,
  Reply,
  Shield,
  Edit2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MessageReactions from "./chat/MessageReactions";
import SurpriseMessage from "./SurpriseMessage";

const MessageBubble = ({
  message,
  isOwn,
  showAvatar,
  avatar,
  onMediaClick,
  onAddReaction,
  onRemoveReaction,
  onDeleteMessage,
  onReplyMessage,
  onEditMessage,
  onRevealSurprise,
  onMarkAsRead,
  onBlockUser,
  recipientId,
  currentUserId,
}) => {
  const { user } = useAuth();
  console.log("MessageBubble: Received props", {
    messageId: message._id,
    onAddReaction: !!onAddReaction,
    onRemoveReaction: !!onRemoveReaction,
    currentUserId,
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content || "");
  const deleteMenuRef = useRef(null);
  const editInputRef = useRef(null);
  const messageRef = useRef(null);

  // Close delete menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        deleteMenuRef.current &&
        !deleteMenuRef.current.contains(event.target)
      ) {
        setShowDeleteMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine if message is from current user
  const isOwnMessage = message.sender?._id === user?._id || isOwn;

  // Auto-mark messages as read when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isOwnMessage && onMarkAsRead) {
            // Check if message hasn't been read by current user
            const currentUserId = user?._id;
            const hasCurrentUserRead = message.readBy?.some(
              (r) => r.user === currentUserId || r.user._id === currentUserId
            );

            if (!hasCurrentUserRead) {
              // Delay marking as read to ensure user actually sees the message
              setTimeout(() => {
                if (entry.isIntersecting) {
                  onMarkAsRead(message._id);
                }
              }, 1000); // 1 second delay
            }
          }
        });
      },
      {
        threshold: 0.5, // Message needs to be 50% visible
      }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, [message._id, isOwnMessage, onMarkAsRead, user?._id, message.readBy]);

  // Calculate read status
  const hasBeenRead =
    message.readBy &&
    message.readBy.some((r) => r.user !== message.sender?._id);
  const hasBeenDelivered =
    message.deliveredTo && message.deliveredTo.length > 0;

  // Determine tick mark state
  const getTickMarkState = () => {
    if (message.isOptimistic) return "sending";
    if (hasBeenRead) return "read";
    if (hasBeenDelivered) return "delivered";
    return "sent";
  };

  const tickState = getTickMarkState();

  // Debug tick state (remove in production)
  console.log("🔄 Tick state calculation:", {
    messageId: message._id,
    isOptimistic: message.isOptimistic,
    hasBeenRead,
    hasBeenDelivered,
    tickState,
    readBy: message.readBy,
    deliveredTo: message.deliveredTo,
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDeleteForMe = () => {
    if (onDeleteMessage) {
      onDeleteMessage(message._id, "me");
    }
    setShowDeleteMenu(false);
  };

  const handleDeleteForEveryone = () => {
    if (onDeleteMessage) {
      onDeleteMessage(message._id, "everyone");
    }
    setShowDeleteMenu(false);
  };
  const handleReply = () => {
    if (onReplyMessage) {
      onReplyMessage(message);
    }
    setShowDeleteMenu(false);
  };

  const handleEdit = () => {
    if (onEditMessage) {
      const currentContent = message.content || message.text || "";
      console.log("Starting edit with content:", currentContent);
      setEditContent(currentContent);
      setIsEditing(true);
    }
    setShowDeleteMenu(false);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEditMessage(message._id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content || "");
  };

  const handleEditKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(
        editContent.length,
        editContent.length
      );
    }
  }, [isEditing, editContent.length]);

  const handleBlockUser = () => {
    if (onBlockUser && recipientId) {
      onBlockUser(recipientId);
    }
    setShowDeleteMenu(false);
  };

  const handleAudioPlay = async () => {
    if (!audioElement) {
      console.error("Audio element not found");
      return;
    }

    try {
      if (isAudioPlaying) {
        audioElement.pause();
        setIsAudioPlaying(false);
      } else {
        // Check if audio source is valid
        if (!audioElement.src || audioElement.src === window.location.href) {
          console.error("Invalid audio source");
          return;
        }

        // Reset audio to beginning if it ended
        if (audioElement.ended) {
          audioElement.currentTime = 0;
        }

        // Try to load the audio first
        audioElement.load();

        // Wait for audio to be ready
        await new Promise((resolve, reject) => {
          const onCanPlay = () => {
            audioElement.removeEventListener("canplay", onCanPlay);
            audioElement.removeEventListener("error", onError);
            resolve();
          };

          const onError = (e) => {
            audioElement.removeEventListener("canplay", onCanPlay);
            audioElement.removeEventListener("error", onError);
            reject(
              new Error(
                `Audio load failed: ${
                  e.target.error?.message || "Unknown error"
                }`
              )
            );
          };

          audioElement.addEventListener("canplay", onCanPlay);
          audioElement.addEventListener("error", onError);

          // Timeout after 5 seconds
          setTimeout(() => {
            audioElement.removeEventListener("canplay", onCanPlay);
            audioElement.removeEventListener("error", onError);
            reject(new Error("Audio load timeout"));
          }, 5000);
        });

        await audioElement.play();
        setIsAudioPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsAudioPlaying(false);
    }
  };

  const renderRepliedMessage = () => {
    if (!message.replyTo) return null;

    const repliedMsg = message.replyTo;
    const repliedContent =
      repliedMsg.content ||
      repliedMsg.text ||
      (repliedMsg.type === "voice"
        ? "Voice message"
        : repliedMsg.type === "image"
        ? "Image"
        : repliedMsg.type === "file"
        ? repliedMsg.fileName || "File"
        : "Message");

    return (
      <div
        className={`mb-2 p-2 rounded-lg border-l-4 ${
          isOwnMessage
            ? "border-white bg-white bg-opacity-20 text-white"
            : "border-primary-500 bg-gray-50 dark:bg-dark-600 text-gray-700 dark:text-gray-300"
        }`}
      >
        <p
          className={`text-xs font-medium ${
            isOwnMessage
              ? "text-white text-opacity-80"
              : "text-primary-600 dark:text-primary-400"
          }`}
        >
          {repliedMsg.sender?.name || "Someone"}
        </p>
        <p
          className={`text-sm ${
            isOwnMessage
              ? "text-white text-opacity-90"
              : "text-gray-600 dark:text-gray-400"
          } truncate`}
        >
          {repliedContent}
        </p>
      </div>
    );
  };

  const renderMessageContent = () => {
    const messageType = message.type || "text";

    switch (messageType) {
      case "text":
        const textContent = message.content || message.text || "";

        if (isEditing && isOwnMessage) {
          return (
            <div className="space-y-2">
              <textarea
                ref={editInputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleEditKeyPress}
                className="w-full px-3 py-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-gray-900 dark:text-gray-100"
                rows="3"
                maxLength="5000"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        }

        return (
          <div>
            <p className="text-sm leading-relaxed break-words">{textContent}</p>
            {message.isEdited && (
              <span className="text-xs text-gray-500 dark:text-gray-400 italic mt-1 block">
                (edited)
              </span>
            )}
          </div>
        );

      case "image":
        // Fix URL construction
        let imageUrl;
        if (message.mediaUrl?.startsWith("http")) {
          imageUrl = message.mediaUrl;
        } else {
          // Ensure URL starts with forward slash
          const cleanUrl = message.mediaUrl?.startsWith("/")
            ? message.mediaUrl
            : `/${message.mediaUrl}`;
          imageUrl = `${
            import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
          }${cleanUrl}`;
        }

        return (
          <div
            className="max-w-md cursor-pointer"
            onClick={() =>
              onMediaClick?.({
                type: "image",
                url: imageUrl,
                name: message.fileName || "Image",
                timestamp: message.createdAt,
              })
            }
          >
            <img
              src={imageUrl}
              alt="Shared image"
              className="rounded-lg w-full h-auto min-h-[150px] max-h-96 object-cover hover:opacity-90 transition-opacity"
              loading="lazy"
              onLoad={() => console.log("Image loaded successfully:", imageUrl)}
              onError={(e) => {
                console.error("Image load error for URL:", imageUrl);
                console.error("Original mediaUrl:", message.mediaUrl);
                console.error("Error event:", e);
                // Show a better placeholder
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `
                  <div class="rounded-lg w-full min-h-[150px] max-h-96 bg-gray-200 flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-gray-400 text-4xl mb-2">📷</div>
                      <p class="text-gray-500 text-sm">Image failed to load</p>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        );

      case "gif":
        return (
          <div
            className="max-w-md cursor-pointer"
            onClick={() =>
              onMediaClick?.({
                type: "gif",
                url: message.content,
                name: message.metadata?.title || "GIF",
                timestamp: message.createdAt,
              })
            }
          >
            <img
              src={message.content}
              alt="GIF"
              className="rounded-lg w-full h-auto min-h-[150px] max-h-96 object-cover hover:opacity-90 transition-opacity"
            />
          </div>
        );

      case "voice":
        // Ensure mediaUrl starts with forward slash
        const cleanMediaUrl = message.mediaUrl?.startsWith("/")
          ? message.mediaUrl
          : `/${message.mediaUrl}`;

        const audioUrl = message.mediaUrl?.startsWith("http")
          ? message.mediaUrl
          : `${
              import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
            }${cleanMediaUrl}`;

        return (
          <div className="flex items-center space-x-3 min-w-[200px]">
            <button
              onClick={handleAudioPlay}
              className={`p-2 rounded-full transition-colors ${
                isOwnMessage
                  ? "bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                  : "bg-primary-100 hover:bg-primary-200 text-primary-600"
              }`}
            >
              {isAudioPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <div className="flex-1">
              <div
                className={`h-1 rounded-full ${
                  isOwnMessage ? "bg-white bg-opacity-20" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all ${
                    isOwnMessage ? "bg-white" : "bg-primary-500"
                  }`}
                  style={{ width: `${audioProgress}%` }}
                ></div>
              </div>
            </div>

            <span
              className={`text-xs ${
                isOwnMessage ? "text-white text-opacity-80" : "text-gray-500"
              }`}
            >
              {message.metadata?.duration
                ? formatDuration(message.metadata.duration)
                : "0:00"}
            </span>

            <audio
              ref={(el) => setAudioElement(el)}
              src={audioUrl}
              onPlay={() => setIsAudioPlaying(true)}
              onPause={() => setIsAudioPlaying(false)}
              onEnded={() => {
                setIsAudioPlaying(false);
                setAudioProgress(0);
              }}
              onTimeUpdate={(e) => {
                const audio = e.target;
                if (audio.duration > 0) {
                  const progress = (audio.currentTime / audio.duration) * 100;
                  setAudioProgress(progress);
                }
              }}
              onLoadedMetadata={(e) => {
                setAudioDuration(e.target.duration);
              }}
              onError={(e) => {
                setIsAudioPlaying(false);
                setAudioProgress(0);
              }}
              className="hidden"
              preload="metadata"
              crossOrigin="anonymous"
            />
          </div>
        );

      case "file":
        const fileName = message.fileName || message.content || "File";
        const fileSize = message.fileSize || 0;

        return (
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg min-w-[200px] ${
              isOwnMessage
                ? "bg-white bg-opacity-10"
                : "bg-gray-50 dark:bg-dark-600"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                isOwnMessage
                  ? "bg-white bg-opacity-20 text-white"
                  : "bg-primary-100 text-primary-600"
              }`}
            >
              📎
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  isOwnMessage ? "text-white" : "text-gray-900 dark:text-white"
                }`}
              >
                {fileName}
              </p>
              {fileSize > 0 && (
                <p
                  className={`text-xs ${
                    isOwnMessage
                      ? "text-white text-opacity-70"
                      : "text-gray-500"
                  }`}
                >
                  {formatFileSize(fileSize)}
                </p>
              )}
            </div>

            <button
              onClick={() =>
                onMediaClick?.({
                  type: "file",
                  url: message.mediaUrl,
                  name: fileName,
                  size: fileSize,
                  timestamp: message.createdAt,
                })
              }
              className={`p-1 rounded transition-colors ${
                isOwnMessage
                  ? "hover:bg-white hover:bg-opacity-20 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-dark-500 text-gray-500"
              }`}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        );

      case "surprise":
        return (
          <SurpriseMessage
            message={message}
            onReveal={onRevealSurprise}
            isOwnMessage={isOwnMessage}
          />
        );

      default:
        return (
          <p className="text-sm leading-relaxed break-words">
            {message.content || message.text || "Unsupported message type"}
          </p>
        );
    }
  };

  return (
    <div
      ref={messageRef}
      className={`flex items-end space-x-2 mb-4 animate-fade-in ${
        isOwnMessage ? "flex-row-reverse space-x-reverse" : "flex-row"
      } ${showDeleteMenu ? "relative z-[9999]" : ""}`}
      style={showDeleteMenu ? { zIndex: 9999 } : {}}
    >
      {/* Avatar */}
      {showAvatar && !isOwnMessage && (
        <img
          src={avatar}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}
      {!showAvatar && !isOwnMessage && <div className="w-8" />}

      {/* Message Content */}
      <div
        className={`max-w-[70%] relative group ${
          isOwnMessage ? "items-end" : "items-start"
        } ${showDeleteMenu ? "z-[9999]" : ""}`}
        style={showDeleteMenu ? { zIndex: 9999 } : {}}
      >
        {/* Delete Menu Button */}
        <div
          className={`absolute -top-2 ${
            isOwnMessage ? "-left-8" : "-right-8"
          } opacity-0 group-hover:opacity-100 transition-opacity z-50`}
        >
          <div className="relative" ref={deleteMenuRef}>
            <button
              onClick={() => setShowDeleteMenu(!showDeleteMenu)}
              className="p-1 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg z-50"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Delete Dropdown Menu */}
            {showDeleteMenu && (
              <div
                className={`fixed ${
                  isOwnMessage ? "right-4" : "left-4"
                } bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-200 dark:border-dark-600 py-1 min-w-[150px]`}
                style={{
                  zIndex: 99999,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <button
                  onClick={handleReply}
                  className="w-full px-3 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center space-x-2"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                {isOwnMessage && message.type === "text" && (
                  <button
                    onClick={handleEdit}
                    className="w-full px-3 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit message</span>
                  </button>
                )}
                {!isOwnMessage && onBlockUser && recipientId && (
                  <button
                    onClick={handleBlockUser}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Block User</span>
                  </button>
                )}
                <button
                  onClick={handleDeleteForMe}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete for me</span>
                </button>
                {isOwnMessage && (
                  <button
                    onClick={handleDeleteForEveryone}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete for everyone</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwnMessage
              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-sm"
              : "bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white rounded-bl-sm"
          } ${message.isOptimistic ? "opacity-70" : ""}`}
        >
          {renderRepliedMessage()}
          {renderMessageContent()}
        </div>

        {/* Reactions */}
        <MessageReactions
          reactions={message.reactions || []}
          onAddReaction={(emoji) => {
            console.log("MessageBubble: onAddReaction called", {
              messageId: message._id,
              emoji,
            });
            onAddReaction?.(message._id, emoji);
          }}
          onRemoveReaction={(emoji) => {
            console.log("MessageBubble: onRemoveReaction called", {
              messageId: message._id,
              emoji,
            });
            onRemoveReaction?.(message._id, emoji);
          }}
          currentUserId={currentUserId || user?._id}
        />

        {/* Timestamp and Read Status */}
        <div
          className={`flex items-center space-x-1 mt-1 px-2 ${
            isOwnMessage ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatMessageTime(message.createdAt || message.timestamp)}
          </span>
          {isOwnMessage && (
            <span className="flex items-center">
              {tickState === "sending" && (
                <div className="w-3.5 h-3.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
              )}
              {tickState === "sent" && (
                <Check className="w-3.5 h-3.5 text-gray-400" />
              )}
              {tickState === "delivered" && (
                <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
              )}
              {tickState === "read" && (
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Spacer for own messages */}
      {isOwnMessage && <div className="w-8" />}
    </div>
  );
};

export default MessageBubble;
