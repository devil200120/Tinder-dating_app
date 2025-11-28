import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  X,
  Reply,
  Shield,
  AlertTriangle,
  Gift,
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import EmojiPicker from "./chat/EmojiPicker";
import VoiceRecorder from "./chat/VoiceRecorder";
import GifPicker from "./chat/GifPicker";
import ImageUploader from "./chat/ImageUploader";
import MediaViewer from "./chat/MediaViewer";
import TypingIndicator from "./chat/TypingIndicator";
import SurpriseMessageInput from "./SurpriseMessageInput";

const ChatBox = ({
  messages,
  onSendMessage,
  onSendSurprise,
  onRevealSurprise,
  onMarkAsRead,
  recipientAvatar,
  recipientName,
  isTyping = false,
  onTypingStart,
  onTypingStop,
  isNavbarHidden = false,
  onDeleteMessage,
  onReplyMessage,
  onEditMessage,
  onAddReaction,
  onRemoveReaction,
  replyingTo,
  onCancelReply,
  onBlockUser,
  recipientId,
  isBlocked = false,
  currentUserId,
}) => {
  console.log("ChatBox: Received reaction handlers", {
    onAddReaction: !!onAddReaction,
    onRemoveReaction: !!onRemoveReaction,
    currentUserId,
  });
  const [messageText, setMessageText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showSurpriseInput, setShowSurpriseInput] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change or when typing indicator appears
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim(), "text");
      setMessageText("");
      inputRef.current?.focus();

      // Stop typing indicator
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (onTypingStop) {
        onTypingStop();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    // Handle typing indicators
    if (onTypingStart && e.target.value.trim()) {
      onTypingStart();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        if (onTypingStop) {
          onTypingStop();
        }
      }, 2000);
    } else if (onTypingStop && !e.target.value.trim()) {
      onTypingStop();
    }
  };

  const handleEmojiSelect = (emoji) => {
    const newText = messageText + emoji;
    setMessageText(newText);
    inputRef.current?.focus();
  };

  const handleVoiceMessage = (audioBlob, duration) => {
    // Convert blob to file
    const audioFile = new File([audioBlob], `voice_${Date.now()}.wav`, {
      type: "audio/wav",
    });

    onSendMessage("", "voice", audioFile, { duration });
  };

  const handleGifSelect = (gifUrl, title) => {
    onSendMessage(gifUrl, "gif", null, { title });
  };

  const handleFileSelect = (file, type) => {
    onSendMessage("", type === "image" ? "image" : "file", file);
  };

  const handleSurpriseMessage = (content, surpriseEmoji) => {
    if (onSendSurprise) {
      onSendSurprise(content, surpriseEmoji);
    }
  };

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setShowMediaViewer(true);
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [messageText]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div
        className={`flex-1 overflow-y-auto px-4 sm:px-6 space-y-3 ${
          isNavbarHidden ? "py-6" : "py-4"
        }`}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-4xl filter drop-shadow-lg">👋</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Start your conversation! ✨
            </h3>

            <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              Say hello to{" "}
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {recipientName}
              </span>{" "}
              and begin your amazing journey together!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const showAvatar =
                index === 0 ||
                messages[index - 1].sender?._id !== message.sender?._id;

              return (
                <MessageBubble
                  key={message._id || message.id || index}
                  message={message}
                  isOwn={false} // Let MessageBubble determine this
                  showAvatar={showAvatar}
                  avatar={recipientAvatar}
                  onMediaClick={handleMediaClick}
                  onDeleteMessage={onDeleteMessage}
                  onReplyMessage={onReplyMessage}
                  onEditMessage={onEditMessage}
                  onRevealSurprise={onRevealSurprise}
                  onMarkAsRead={onMarkAsRead}
                  onAddReaction={onAddReaction}
                  onRemoveReaction={onRemoveReaction}
                  onBlockUser={onBlockUser}
                  recipientId={recipientId}
                  currentUserId={currentUserId}
                />
              );
            })}

            {/* Typing Indicator */}
            <TypingIndicator
              isTyping={isTyping}
              userName={recipientName}
              avatar={recipientAvatar}
            />

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="border-t border-gray-200/50 dark:border-dark-700/50 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-xl px-4 py-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Reply className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                Replying to {replyingTo.sender?.name || "Someone"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {replyingTo.content ||
                  replyingTo.text ||
                  (replyingTo.type === "voice"
                    ? "Voice message"
                    : replyingTo.type === "image"
                    ? "Image"
                    : replyingTo.type === "file"
                    ? replyingTo.fileName || "File"
                    : "Message")}
              </p>
            </div>
            <button
              onClick={onCancelReply}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Input Area */}
      {isBlocked ? (
        // Blocked State
        <div className="border-t border-gray-200/50 dark:border-dark-700/50 bg-red-50/90 dark:bg-red-900/20 backdrop-blur-xl">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  This user has been blocked
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  You cannot send messages to blocked users
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Normal Input Area
        <div
          className={`border-t border-gray-200/50 dark:border-dark-700/50 bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl transition-all duration-300 ${
            isInputFocused
              ? "border-primary-200 dark:border-primary-800 shadow-lg"
              : ""
          }`}
        >
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            {/* Surprise Message Input */}
            {showSurpriseInput && (
              <SurpriseMessageInput
                onSendSurprise={handleSurpriseMessage}
                onCancel={() => setShowSurpriseInput(false)}
              />
            )}

            <form onSubmit={handleSubmit} className="flex items-end space-x-3">
              {/* Media Controls */}
              <div className="flex items-center space-x-1 sm:space-x-2 pb-2">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  className="transform hover:scale-110 transition-transform"
                />
                <ImageUploader
                  onFileSelect={handleFileSelect}
                  className="transform hover:scale-110 transition-transform"
                />
                <GifPicker
                  onGifSelect={handleGifSelect}
                  className="transform hover:scale-110 transition-transform"
                />
                <VoiceRecorder
                  onVoiceMessage={handleVoiceMessage}
                  className="transform hover:scale-110 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => setShowSurpriseInput(!showSurpriseInput)}
                  className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                    showSurpriseInput
                      ? "bg-pink-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900 hover:text-pink-600"
                  }`}
                  title="Send surprise message"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Message Input */}
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={messageText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder={`Message ${recipientName}...`}
                  rows="1"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 overflow-hidden transition-all duration-200 ${
                    messageText.trim() ? "shadow-md" : ""
                  }`}
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />

                {/* Character indicator for long messages */}
                {messageText.length > 100 && (
                  <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                    {messageText.length}
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!messageText.trim()}
                className={`p-3 rounded-2xl transition-all duration-300 flex-shrink-0 group ${
                  messageText.trim()
                    ? "bg-gradient-to-r from-primary-500 to-pink-500 text-white hover:from-primary-600 hover:to-pink-600 hover:scale-110 hover:shadow-xl shadow-lg transform active:scale-95"
                    : "bg-gray-200 dark:bg-dark-700 text-gray-400 cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                <Send
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    messageText.trim() ? "animate-pulse" : ""
                  }`}
                />
              </button>
            </form>

            {/* Quick actions hint */}
            {!messageText && (
              <div className="flex items-center justify-center mt-2 opacity-60">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  💡 Tap icons for emojis, photos, GIFs, or voice messages
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Media Viewer */}
      <MediaViewer
        media={selectedMedia}
        isOpen={showMediaViewer}
        onClose={() => {
          setShowMediaViewer(false);
          setSelectedMedia(null);
        }}
      />
    </div>
  );
};

export default ChatBox;
