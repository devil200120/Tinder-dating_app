import React, { useState } from "react";
import { Gift, Send, X } from "lucide-react";

const SurpriseMessageInput = ({ onSendSurprise, onCancel }) => {
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🎉");

  const emojis = [
    "🎉",
    "🎊",
    "🎁",
    "💕",
    "❤️",
    "💝",
    "🌟",
    "✨",
    "🎈",
    "🎀",
    "💖",
    "🥳",
  ];

  const handleSend = () => {
    if (content.trim()) {
      onSendSurprise(content.trim(), selectedEmoji);
      setContent("");
      onCancel();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-700 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Gift className="w-5 h-5 text-pink-500" />
        <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
          Send a Surprise Message
        </span>
        <button
          onClick={onCancel}
          className="ml-auto p-1 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Emoji selector */}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Choose surprise emoji:
          </label>
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                  selectedEmoji === emoji
                    ? "bg-pink-500 text-white scale-110"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-pink-100 dark:hover:bg-pink-900 hover:scale-105"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Message input */}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Your surprise message:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your surprise message here... The recipient will need to tap to reveal it with confetti!"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-900 dark:text-gray-100"
            rows="3"
            maxLength="5000"
          />
        </div>

        {/* Send button */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!content.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Gift className="w-4 h-4" />
            <span>Send Surprise</span>
          </button>
        </div>
      </div>

      <div className="mt-3 p-2 bg-pink-100 dark:bg-pink-900/30 rounded text-xs text-pink-700 dark:text-pink-300">
        💡 <strong>Tip:</strong> The recipient will see a gift box and need to
        tap it to reveal your message with a beautiful confetti animation!
      </div>
    </div>
  );
};

export default SurpriseMessageInput;
