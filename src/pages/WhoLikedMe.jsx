import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, X, Star, CheckCircle, Clock } from "lucide-react";
import { swipeService } from "../services/swipeService";
import { formatTimestamp } from "../utils/helpers";
import { useToast } from "../context/ToastContext";

const WhoLikedMe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [likedMeUsers, setLikedMeUsers] = useState([]);
  const [superLikedMeUsers, setSuperLikedMeUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchWhoLikedMe();
  }, []);

  const fetchWhoLikedMe = async () => {
    try {
      setLoading(true);
      const response = await swipeService.getWhoLikedMe();

      if (response.success) {
        const likes = response.data || [];
        const regularLikes = likes.filter((like) => like.type === "like");
        const superLikes = likes.filter((like) => like.type === "superlike");

        setLikedMeUsers(regularLikes);
        setSuperLikedMeUsers(superLikes);
      }
    } catch (error) {
      console.error("Failed to fetch who liked me:", error);
      if (error.response?.status === 403) {
        toast.error(
          "This is a premium feature. Please upgrade to see who liked you.",
          {
            title: "Premium Required",
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBack = async (user, swipeType = "like") => {
    try {
      setProcessingId(user._id);

      // Swipe back on the user
      const response = await swipeService.swipeUser(user._id, swipeType);

      if (response.success) {
        // Check if it's a match
        if (response.data?.match) {
          toast.success(`🎉 It's a Match with ${user.name}!`, {
            title: "New Match!",
            description: "You can now start chatting!",
          });

          // Remove from liked me list since it's now a match
          setLikedMeUsers((prev) =>
            prev.filter((like) => like.swiper._id !== user._id)
          );
          setSuperLikedMeUsers((prev) =>
            prev.filter((like) => like.swiper._id !== user._id)
          );

          // Navigate to matches or chat
          setTimeout(() => {
            navigate("/matches");
          }, 2000);
        } else {
          toast.success(`You liked ${user.name} back!`, {
            title: "Like Sent!",
          });

          // Remove from list
          setLikedMeUsers((prev) =>
            prev.filter((like) => like.swiper._id !== user._id)
          );
          setSuperLikedMeUsers((prev) =>
            prev.filter((like) => like.swiper._id !== user._id)
          );
        }
      }
    } catch (error) {
      console.error("Failed to like back:", error);
      toast.error("Failed to send like. Please try again.", {
        title: "Error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handlePass = async (user) => {
    try {
      setProcessingId(user._id);

      // Dislike the user
      await swipeService.swipeUser(user._id, "dislike");

      // Remove from liked me list
      setLikedMeUsers((prev) =>
        prev.filter((like) => like.swiper._id !== user._id)
      );
      setSuperLikedMeUsers((prev) =>
        prev.filter((like) => like.swiper._id !== user._id)
      );

      toast.success("User passed", {
        title: "Passed",
      });
    } catch (error) {
      console.error("Failed to pass user:", error);
      toast.error("Failed to pass user. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/profile/${user._id}`, { state: { user } });
  };

  const allLikedMeUsers = [...likedMeUsers, ...superLikedMeUsers].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredUsers = () => {
    switch (activeTab) {
      case "likes":
        return likedMeUsers;
      case "superlikes":
        return superLikedMeUsers;
      default:
        return allLikedMeUsers;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:bg-dark-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading who liked you...
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
                Who Liked Me 💕
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {allLikedMeUsers.length}{" "}
                {allLikedMeUsers.length === 1 ? "person likes" : "people like"}{" "}
                you - like them back to match!
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
            All ({allLikedMeUsers.length})
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
            Likes ({likedMeUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("superlikes")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "superlikes"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Star className="w-4 h-4 inline mr-1" fill="currentColor" />
            Super Likes ({superLikedMeUsers.length})
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
                No one liked you yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Keep swiping and your perfect match will find you!
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers().map((like, index) => {
              const user = like.swiper;
              if (!user) return null;

              const isProcessing = processingId === user._id;

              return (
                <div
                  key={like._id}
                  className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src={
                        user.photos?.[0]?.url ||
                        user.photos?.[0] ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name || "User"
                        )}&size=400&background=gradient&color=ffffff`
                      }
                      alt={user.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    />

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      {like.type === "superlike" ? (
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                          <Star className="w-4 h-4" fill="currentColor" />
                          <span className="text-sm font-bold">SUPER</span>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                          <Heart className="w-4 h-4" fill="currentColor" />
                          <span className="text-sm font-bold">LIKED</span>
                        </div>
                      )}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* User Info */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
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
                    {/* Time info */}
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Liked you {formatTimestamp(like.createdAt)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {/* Pass Button */}
                      <button
                        onClick={() => handlePass(user)}
                        disabled={isProcessing}
                        className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <X className="w-5 h-5" />
                        <span>Pass</span>
                      </button>

                      {/* Like Back Button */}
                      <button
                        onClick={() => handleLikeBack(user, "like")}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isProcessing ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Heart className="w-5 h-5" fill="currentColor" />
                        )}
                        <span>{isProcessing ? "Liking..." : "Like Back"}</span>
                      </button>

                      {/* Super Like Back Button (for super likes) */}
                      {like.type === "superlike" && (
                        <button
                          onClick={() => handleLikeBack(user, "superlike")}
                          disabled={isProcessing}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Super Like Back"
                        >
                          <Star className="w-5 h-5" fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            How "Like Me Back" Works
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>• These people already liked you first</p>
            <p>• Click "Like Back" to create an instant match</p>
            <p>• Click "Pass" to decline politely</p>
            <p>
              • Super likes show extra interest - consider super liking back!
            </p>
            <p>• Once you like back, you'll both get a match notification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoLikedMe;
