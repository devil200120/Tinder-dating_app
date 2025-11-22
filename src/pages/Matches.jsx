import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Search, Filter } from "lucide-react";
import { useChat } from "../hooks/useChat";
import Avatar from "../components/Avatar";
import { formatTimestamp } from "../utils/helpers";

const Matches = () => {
  const navigate = useNavigate();
  const { matches, getUserById } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);

  const filteredMatches = matches.filter((match) => {
    const matchesSearch = match.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesOnline = !filterOnline || match.online;
    return matchesSearch && matchesOnline;
  });

  const handleMatchClick = (match) => {
    const user = getUserById(match.userId);
    if (user) {
      navigate(`/profile/${user.id}`, { state: { user } });
    }
  };

  const handleMessageClick = (e, match) => {
    e.stopPropagation();
    navigate(`/chats/${match.userId}`);
  };

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="text-center max-w-lg relative z-10 animate-fade-in">
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
            <div className="w-32 h-32 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Heart className="w-16 h-16 text-white fill-current animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Your Love Story Awaits! ✨
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
              Start your journey to find meaningful connections. Swipe, match,
              and discover amazing people waiting to meet you!
            </p>
            <button
              onClick={() => navigate("/discover")}
              className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Adventure 💫
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:bg-dark-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-10 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-10 right-1/4 w-56 h-56 bg-indigo-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Heart className="w-8 h-8 text-white fill-current" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Your Matches ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {matches.length} amazing{" "}
            {matches.length === 1 ? "connection" : "connections"} waiting for
            you
          </p>
        </div>

        {/* Enhanced Search and Filter */}
        <div
          className="mb-8 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your amazing matches..."
                  className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <button
                onClick={() => setFilterOnline(!filterOnline)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filterOnline
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "bg-white/70 dark:bg-dark-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-600 hover:border-purple-300"
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Online Only</span>
                {filterOnline && (
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-white/60 dark:bg-dark-800/60 backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto border border-white/20">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No matches found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMatches.map((match, index) => {
              const user = getUserById(match.userId);

              return (
                <div
                  key={match.id}
                  onClick={() => handleMatchClick(match)}
                  className="group cursor-pointer animate-fade-in hover:scale-[1.02] transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-500">
                    {/* Enhanced Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={match.image}
                        alt={match.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Enhanced Online Status */}
                      {match.online && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                          <span>Online</span>
                        </div>
                      )}

                      {/* Love Badge */}
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white p-2 rounded-full shadow-lg">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>

                      {/* Enhanced Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Enhanced Info Section */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
                          {match.name}, {match.age}
                        </h3>
                        {user && (
                          <p className="text-sm opacity-90 line-clamp-2 drop-shadow">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Actions Section */}
                    <div className="p-4 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-dark-800/90 dark:to-dark-700/90 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                          <span>
                            Matched {formatTimestamp(match.timestamp)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleMessageClick(e, match)}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Call to Action */}
        <div
          className="mt-16 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 shadow-xl">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white fill-current animate-pulse" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Ready for more connections? 💕
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
              The perfect match could be just one swipe away. Keep exploring!
            </p>
            <button
              onClick={() => navigate("/discover")}
              className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Continue Your Journey ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
