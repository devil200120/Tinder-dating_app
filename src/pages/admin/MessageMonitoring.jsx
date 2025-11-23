import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MessageMonitoring = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages = [
      {
        id: 1,
        sender: { name: "Emma Watson", avatar: "🙋‍♀️", age: 28, verified: true },
        receiver: {
          name: "John Smith",
          avatar: "👨‍💼",
          age: 32,
          verified: false,
        },
        content:
          "Hey! How was your day? I had an amazing time at the coffee shop today ☕",
        timestamp: "2024-11-24 14:30:25",
        status: "active",
        flagged: false,
        reports: 0,
        chatId: "chat_001",
        messageType: "text",
        sentiment: "positive",
      },
      {
        id: 2,
        sender: { name: "Mike Johnson", avatar: "🧑‍🎨", age: 29, verified: true },
        receiver: {
          name: "Sarah Davis",
          avatar: "👩‍💻",
          age: 26,
          verified: true,
        },
        content:
          "Want to meet up sometime? I know this great restaurant downtown 🍽️",
        timestamp: "2024-11-24 13:15:10",
        status: "flagged",
        flagged: true,
        reports: 2,
        chatId: "chat_002",
        messageType: "text",
        sentiment: "neutral",
      },
      {
        id: 3,
        sender: { name: "Alex Chen", avatar: "🧑‍🚀", age: 35, verified: false },
        receiver: { name: "Lisa Brown", avatar: "👩‍🔬", age: 30, verified: true },
        content:
          "This is inappropriate content that should be flagged by moderators",
        timestamp: "2024-11-24 12:45:33",
        status: "blocked",
        flagged: true,
        reports: 5,
        chatId: "chat_003",
        messageType: "text",
        sentiment: "negative",
      },
      {
        id: 4,
        sender: { name: "David Wilson", avatar: "🎸", age: 27, verified: true },
        receiver: {
          name: "Anna Taylor",
          avatar: "🎭",
          age: 25,
          verified: true,
        },
        content:
          "I love your music taste! That concert was incredible last night 🎵✨",
        timestamp: "2024-11-24 11:20:15",
        status: "active",
        flagged: false,
        reports: 0,
        chatId: "chat_004",
        messageType: "text",
        sentiment: "positive",
      },
      {
        id: 5,
        sender: { name: "Rachel Green", avatar: "🌸", age: 31, verified: true },
        receiver: {
          name: "Tom Anderson",
          avatar: "🏋️‍♂️",
          age: 34,
          verified: false,
        },
        content:
          "Thanks for the great conversation! Looking forward to our date 💕",
        timestamp: "2024-11-24 10:55:42",
        status: "active",
        flagged: false,
        reports: 0,
        chatId: "chat_005",
        messageType: "text",
        sentiment: "positive",
      },
    ];
    setMessages(mockMessages);
  }, []);

  const stats = {
    total: messages.length,
    flagged: messages.filter((m) => m.flagged).length,
    blocked: messages.filter((m) => m.status === "blocked").length,
    active: messages.filter((m) => m.status === "active").length,
    reports: messages.reduce((sum, m) => sum + m.reports, 0),
  };

  const filteredMessages = messages
    .filter((message) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "flagged") return message.flagged;
      if (filterStatus === "blocked") return message.status === "blocked";
      if (filterStatus === "active") return message.status === "active";
      return true;
    })
    .filter(
      (message) =>
        message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.receiver.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === "oldest")
        return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortBy === "most_reported") return b.reports - a.reports;
      return 0;
    });

  const handleActionMessage = (messageId, action) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          if (action === "block")
            return { ...msg, status: "blocked", flagged: true };
          if (action === "unblock")
            return { ...msg, status: "active", flagged: false };
          if (action === "flag") return { ...msg, flagged: true };
          if (action === "unflag") return { ...msg, flagged: false };
        }
        return msg;
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "flagged":
        return "text-yellow-600 bg-yellow-100";
      case "blocked":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "neutral":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">💬 Message Monitoring</h1>
            <p className="text-purple-100 text-lg">
              Monitor and moderate user conversations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-4 h-4 bg-green-400 rounded-full"
            />
            <span className="text-sm font-medium">Live Monitoring</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {[
          {
            label: "Total Messages",
            value: stats.total,
            color: "from-blue-500 to-blue-600",
            icon: "💬",
          },
          {
            label: "Active",
            value: stats.active,
            color: "from-green-500 to-green-600",
            icon: "✅",
          },
          {
            label: "Flagged",
            value: stats.flagged,
            color: "from-yellow-500 to-yellow-600",
            icon: "⚠️",
          },
          {
            label: "Blocked",
            value: stats.blocked,
            color: "from-red-500 to-red-600",
            icon: "🚫",
          },
          {
            label: "Reports",
            value: stats.reports,
            color: "from-purple-500 to-purple-600",
            icon: "📊",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl opacity-80">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search messages, users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </span>
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Messages</option>
              <option value="active">Active Only</option>
              <option value="flagged">Flagged Only</option>
              <option value="blocked">Blocked Only</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_reported">Most Reported</option>
            </select>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              📊 Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              ⚙️ Settings
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Messages ({filteredMessages.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* User Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                          {message.sender.avatar}
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                          {message.receiver.avatar}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">
                          {message.sender.name}
                        </span>
                        {message.sender.verified && (
                          <span className="text-blue-500">✓</span>
                        )}
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-gray-800">
                          {message.receiver.name}
                        </span>
                        {message.receiver.verified && (
                          <span className="text-blue-500">✓</span>
                        )}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            message.status
                          )}`}
                        >
                          {message.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {message.content}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          📅 {new Date(message.timestamp).toLocaleString()}
                        </span>
                        <span className={getSentimentColor(message.sentiment)}>
                          😊 {message.sentiment}
                        </span>
                        {message.reports > 0 && (
                          <span className="text-red-500 font-medium">
                            🚨 {message.reports} reports
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {message.status !== "blocked" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionMessage(message.id, "block");
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Block Message"
                      >
                        🚫
                      </motion.button>
                    )}
                    {message.status === "blocked" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionMessage(message.id, "unblock");
                        }}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Unblock Message"
                      >
                        ✅
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionMessage(
                          message.id,
                          message.flagged ? "unflag" : "flag"
                        );
                      }}
                      className={`p-2 hover:bg-yellow-50 rounded-lg transition-colors duration-200 ${
                        message.flagged ? "text-yellow-600" : "text-gray-500"
                      }`}
                      title={message.flagged ? "Remove Flag" : "Flag Message"}
                    >
                      ⚠️
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="View Details"
                    >
                      👁️
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No messages found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </motion.div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Message Details
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Conversation Info */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                      {selectedMessage.sender.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {selectedMessage.sender.name}
                      </h4>
                      <p className="text-gray-500">
                        Age: {selectedMessage.sender.age} •{" "}
                        {selectedMessage.sender.verified
                          ? "Verified ✓"
                          : "Not verified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                      {selectedMessage.receiver.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {selectedMessage.receiver.name}
                      </h4>
                      <p className="text-gray-500">
                        Age: {selectedMessage.receiver.age} •{" "}
                        {selectedMessage.receiver.verified
                          ? "Verified ✓"
                          : "Not verified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Message Content
                  </h5>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedMessage.content}
                  </p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Timestamp
                    </h5>
                    <p className="text-gray-600">
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Sentiment
                    </h5>
                    <p
                      className={`font-medium ${getSentimentColor(
                        selectedMessage.sentiment
                      )}`}
                    >
                      {selectedMessage.sentiment.charAt(0).toUpperCase() +
                        selectedMessage.sentiment.slice(1)}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Status</h5>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedMessage.status
                      )}`}
                    >
                      {selectedMessage.status}
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Reports
                    </h5>
                    <p className="text-gray-600">
                      {selectedMessage.reports} reports
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg"
                  >
                    🚫 Block Message
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-medium shadow-lg"
                  >
                    ⚠️ Flag for Review
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg"
                  >
                    👥 View Chat
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageMonitoring;
