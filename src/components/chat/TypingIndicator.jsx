import React from "react";

const TypingIndicator = ({ isTyping, userName, avatar }) => {
  if (!isTyping) return null;

  return (
    <div className="flex items-end space-x-2 mb-4 animate-fade-in">
      {/* Avatar */}
      <img
        src={avatar}
        alt={userName}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
      {/* Typing bubble */}
      <div className="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[70%]">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
      <div className="w-8" /> {/* Spacer */}
    </div>
  );
};

export default TypingIndicator;
