import React, { useState } from "react";
import { Plus } from "lucide-react";

const MessageReactions = ({
  reactions = [],
  onAddReaction,
  onRemoveReaction,
  currentUserId,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Quick reaction emojis
  const quickEmojis = ["❤️", "😂", "😮", "😢", "😡", "👍", "👎"];

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {});

  const handleReactionClick = (emoji) => {
    console.log("MessageReactions: Reaction clicked", {
      emoji,
      currentUserId,
      reactions,
    });
    const userReaction = reactions.find(
      (r) =>
        (r.user?._id === currentUserId || r.user === currentUserId) &&
        r.emoji === emoji
    );
    console.log("MessageReactions: User reaction found", userReaction);

    if (userReaction) {
      console.log("MessageReactions: Removing reaction");
      onRemoveReaction(emoji);
    } else {
      console.log("MessageReactions: Adding reaction");
      onAddReaction(emoji);
    }
  };

  const handleQuickReaction = (emoji) => {
    console.log("MessageReactions: Quick reaction clicked", {
      emoji,
      onAddReaction: !!onAddReaction,
    });
    if (!onAddReaction) {
      console.error("MessageReactions: onAddReaction handler is missing!");
      return;
    }
    handleReactionClick(emoji);
    setShowEmojiPicker(false);
  };

  // Don't render if no handlers are provided
  if (!onAddReaction) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1 mt-1">
      {/* Existing reactions */}
      {Object.entries(groupedReactions).map(([emoji, reactionList]) => {
        const hasUserReacted = reactionList.some(
          (r) => r.user?._id === currentUserId || r.user === currentUserId
        );

        return (
          <button
            key={emoji}
            onClick={() => handleReactionClick(emoji)}
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all ${
              hasUserReacted
                ? "bg-primary-100 dark:bg-primary-900 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300"
                : "bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
            }`}
            title={reactionList
              .map((r) => r.user?.name || "Unknown")
              .join(", ")}
          >
            <span>{emoji}</span>
            <span className="font-medium">{reactionList.length}</span>
          </button>
        );
      })}

      {/* Add reaction button - always show */}
      <div className="relative">
        <button
          onClick={() => {
            console.log(
              "MessageReactions: Plus button clicked, toggling picker"
            );
            setShowEmojiPicker(!showEmojiPicker);
          }}
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all"
          title="Add reaction"
        >
          <Plus className="w-3 h-3" />
        </button>

        {/* Quick emoji picker */}
        {showEmojiPicker && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowEmojiPicker(false)}
            />

            {/* Emoji picker */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 p-2 z-50">
              <div className="flex space-x-1">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleQuickReaction(emoji)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageReactions;
