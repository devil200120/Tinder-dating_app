import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Image as ImageIcon } from 'lucide-react';
import MessageBubble from './MessageBubble';

const ChatBox = ({ messages, onSendMessage, recipientAvatar, recipientName }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-dark-900">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start a conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Say hello to {recipientName} and get to know each other!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.senderId === 'me';
              const showAvatar =
                index === 0 ||
                messages[index - 1].senderId !== message.senderId;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  avatar={recipientAvatar}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          {/* Emoji/Image buttons */}
          <div className="flex space-x-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              aria-label="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              aria-label="Add image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows="1"
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-700 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              style={{ maxHeight: '120px' }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!messageText.trim()}
            className={`p-3 rounded-full transition-all duration-300 ${
              messageText.trim()
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:scale-110 hover:shadow-lg'
                : 'bg-gray-200 dark:bg-dark-700 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Typing indicator could go here */}
      </div>
    </div>
  );
};

export default ChatBox;
