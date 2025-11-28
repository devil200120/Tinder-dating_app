import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Clock, Sparkles } from "lucide-react";
import { swipeService } from "../services/swipeService";
import { formatTimestamp } from "../utils/helpers";

const WhoILiked = () => {
  const navigate = useNavigate();
  const [likedUsers, setLikedUsers] = useState([]);
  const [superLikedUsers, setSuperLikedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchLikedUsers();
  }, []);

  const fetchLikedUsers = async () => {
    try {
      setLoading(true);

      // Get regular likes
      const likesResponse = await swipeService.getSwipeHistory("like");
      if (likesResponse.success) {
        setLikedUsers(likesResponse.data || []);
      }

      // Get super likes
      const superLikesResponse = await swipeService.getSwipeHistory(
        "superlike"
      );
      if (superLikesResponse.success) {
        setSuperLikedUsers(superLikesResponse.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch liked users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/profile/${user._id}`, { state: { user } });
  };

  const allLikedUsers = [...likedUsers, ...superLikedUsers].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredUsers = () => {
    switch (activeTab) {
      case "likes":
        return likedUsers;
      case "superlikes":
        return superLikedUsers;
      default:
        return allLikedUsers;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:bg-dark-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your likes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border border-white/20 hover:bg-white dark:hover:bg-dark-700 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                People I Liked ❤️
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {allLikedUsers.length}{" "}
                {allLikedUsers.length === 1 ? "person" : "people"} waiting for
                your match
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm p-1 rounded-xl border border-white/20">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "all"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            All ({allLikedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "likes"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4 inline mr-1" fill="currentColor" />
            Likes ({likedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("superlikes")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "superlikes"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            Super Likes ({superLikedUsers.length})
          </button>
        </div>

        {/* Content */}
        {filteredUsers().length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/60 dark:bg-dark-800/60 backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto border border-white/20">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No likes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start swiping to find people you're interested in!
              </p>
              <button
                onClick={() => navigate("/discover")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Start Discovering
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers().map((swipe, index) => {
              const user = swipe.swiped;
              if (!user) return null;

              return (
                <div
                  key={swipe._id}
                  onClick={() => handleUserClick(user)}
                  className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-white/20 cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src={user.photos?.[0] || "/default-avatar.png"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      {swipe.type === "superlike" ? (
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-full shadow-lg">
                          <Sparkles className="w-4 h-4" fill="currentColor" />
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-2 rounded-full shadow-lg">
                          <Heart className="w-4 h-4" fill="currentColor" />
                        </div>
                      )}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* User Info */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-bold drop-shadow-lg">
                        {user.name}, {user.age}
                      </h3>
                      {user.bio && (
                        <p className="text-sm opacity-90 line-clamp-2 drop-shadow">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Liked {formatTimestamp(swipe.createdAt)}</span>
                      </div>
                      <div className="text-xs font-semibold px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full">
                        {swipe.type === "superlike" ? "Super Liked" : "Liked"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            💡 How Matching Works
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>• When you like someone, they appear here</p>
            <p>• If they like you back, you'll both get a match notification</p>
            <p>• Matches appear in your "Matches" section where you can chat</p>
            <p>
              • Super likes show extra interest and notify the person
              immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoILiked;
