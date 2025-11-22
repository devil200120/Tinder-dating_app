import React from 'react';
import { formatMessageTime } from '../utils/helpers';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isOwn, showAvatar, avatar }) => {
  return (
    <div
      className={`flex items-end space-x-2 mb-4 animate-fade-in ${
        isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <img
          src={avatar}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}
      {!showAvatar && !isOwn && <div className="w-8" />}

      {/* Message Content */}
      <div
        className={`max-w-[70%] ${
          isOwn ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwn
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-sm'
              : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.text}</p>
        </div>
        
        {/* Timestamp and Read Status */}
        <div
          className={`flex items-center space-x-1 mt-1 px-2 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwn && (
            <span className="text-primary-500">
              {message.read ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Spacer for own messages */}
      {isOwn && <div className="w-8" />}
    </div>
  );
};

export default MessageBubble;
