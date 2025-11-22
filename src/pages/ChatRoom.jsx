import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import ChatBox from '../components/ChatBox';
import Avatar from '../components/Avatar';

const ChatRoom = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getMatchById, getUserById, getMessages, sendMessage, markAsRead } = useChat();

  const match = getMatchById(parseInt(userId));
  const user = getUserById(parseInt(userId));
  const messages = getMessages(parseInt(userId));

  useEffect(() => {
    if (match) {
      markAsRead(parseInt(userId));
    }
  }, [userId, match, markAsRead]);

  if (!match || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Chat not found
          </h2>
          <button onClick={() => navigate('/chats')} className="btn-primary mt-4">
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = (text) => {
    sendMessage(parseInt(userId), text);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${userId}`, { state: { user } });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/chats')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>

            <div
              onClick={handleViewProfile}
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Avatar
                src={match.image}
                alt={match.name}
                size="md"
                online={match.online}
              />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {match.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {match.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              title="Voice call"
            >
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              title="Video call"
            >
              <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleViewProfile}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              title="View profile"
            >
              <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              title="More options"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full">
          <ChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            recipientAvatar={match.image}
            recipientName={match.name}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
