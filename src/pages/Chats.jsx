import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import ChatList from '../components/ChatList';

const Chats = () => {
  const { matches, deleteChat } = useChat();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {matches.length} {matches.length === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>

        {/* Chat List */}
        <div className="card overflow-hidden">
          <ChatList matches={matches} onDeleteChat={deleteChat} />
        </div>

        {/* Tips */}
        {matches.length > 0 && (
          <div className="mt-6 card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-primary-500" />
              <span>Chat Tips</span>
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Be genuine and respectful</li>
              <li>• Ask open-ended questions</li>
              <li>• Share about your interests</li>
              <li>• Suggest meeting up when ready</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
