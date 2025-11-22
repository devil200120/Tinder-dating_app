import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { formatTimestamp } from '../utils/helpers';
import { Trash2 } from 'lucide-react';

const ChatList = ({ matches, onDeleteChat }) => {
  const navigate = useNavigate();

  const handleChatClick = (match) => {
    navigate(`/chats/${match.userId}`);
  };

  const handleDelete = (e, matchId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      onDeleteChat(matchId);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No matches yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          Start swiping to find your perfect match and begin conversations!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-dark-700">
      {matches.map((match) => (
        <div
          key={match.id}
          onClick={() => handleChatClick(match)}
          className="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors duration-200 group"
        >
          <div className="relative flex-shrink-0">
            <Avatar
              src={match.image}
              alt={match.name}
              size="lg"
              online={match.online}
            />
            {match.unread && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white dark:border-dark-800 animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                {match.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                {formatTimestamp(match.timestamp)}
              </span>
            </div>
            <p
              className={`text-sm truncate ${
                match.unread
                  ? 'text-gray-900 dark:text-white font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {match.lastMessage}
            </p>
          </div>

          <button
            onClick={(e) => handleDelete(e, match.userId)}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
