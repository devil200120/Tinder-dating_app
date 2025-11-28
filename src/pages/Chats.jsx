import React from "react";
import { MessageCircle, Users, Heart } from "lucide-react";
import { useChat } from "../context/ChatContext";
import ChatList from "../components/ChatList";

const Chats = () => {
  const { matches, deleteChat } = useChat();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-950 dark:to-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-50 to-transparent dark:from-dark-950 dark:to-transparent pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Messages
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>
                  {matches.length}{" "}
                  {matches.length === 1 ? "conversation" : "conversations"}
                </span>
              </div>
            </div>

            {matches.length > 0 && (
              <div className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-2 rounded-full">
                <Heart className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  Active Chats
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chat List */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden mb-6">
          <ChatList matches={matches} onDeleteChat={deleteChat} />
        </div>

        {/* Tips Section */}
        {matches.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-pink-50 dark:from-primary-900/10 dark:to-pink-900/10 rounded-2xl p-6 border border-primary-100 dark:border-primary-800/30">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <MessageCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  💬 Conversation Tips
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Be genuine and respectful
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Ask open-ended questions
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Share about your interests
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Suggest meeting when ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom spacing for mobile */}
        <div className="h-20 sm:h-8"></div>
      </div>
    </div>
  );
};

export default Chats;
