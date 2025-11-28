import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X, Star, RotateCcw } from "lucide-react";
import UserCard from "../components/UserCard";
import { useChat } from "../context/ChatContext";
import { userService } from "../services/userService";
import { swipeService } from "../services/swipeService";
import { matchService } from "../services/matchService";
import { useAuth } from "../context/AuthContext";

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);
  const [passedUsers, setPassedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const { addMatch } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscoverUsers();
  }, []);

  const fetchDiscoverUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getDiscoverUsers();
      console.log("Discover users response:", response);
      if (response.success && response.data) {
        setUsers(response.data);
        setCurrentIndex(0);
      } else {
        setError("Failed to load users for discovery");
      }
    } catch (error) {
      console.error("Failed to fetch discover users:", error);
      setError(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const currentUser = users[currentIndex];

  const handleSwipe = async (direction) => {
    if (!currentUser) return;

    setSwipeDirection(direction);

    try {
      // Map direction to API type
      let type;
      if (direction === "right") type = "like";
      else if (direction === "left") type = "dislike";
      else if (direction === "super") type = "superlike";

      // Call swipe API
      const swipeResponse = await swipeService.swipeUser(
        currentUser._id || currentUser.id,
        type
      );

      if (swipeResponse.success) {
        if (direction === "right" || direction === "super") {
          setLikedUsers([...likedUsers, currentUser._id || currentUser.id]);

          // Show like animation
          setShowLikeAnimation(true);
          setTimeout(() => setShowLikeAnimation(false), 600);

          // Check if it's a match
          if (swipeResponse.data && swipeResponse.data.match) {
            setTimeout(() => {
              setMatchedUser(currentUser);
              setShowMatchModal(true);
              addMatch(currentUser);
            }, 300);
          }
        } else if (direction === "left") {
          setPassedUsers([...passedUsers, currentUser._id || currentUser.id]);
        }

        // Move to next user
        setTimeout(() => {
          if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            // Refetch users when we reach the end
            fetchDiscoverUsers();
          }
          setSwipeDirection(null);
        }, 300);
      }
    } catch (error) {
      console.error("Swipe failed:", error);
      setSwipeDirection(null);

      // Handle specific error cases
      const errorMessage = error.response?.data?.message || error.message;

      if (
        errorMessage.includes("already swiped") ||
        errorMessage.includes("You have already swiped")
      ) {
        // User already swiped on this person, just move to next user
        console.log("User already swiped, moving to next user");
        setTimeout(() => {
          if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            // Refetch users when we reach the end
            fetchDiscoverUsers();
          }
          setSwipeDirection(null);
        }, 300);
      } else {
        // Show error to user for other types of errors
        alert("Failed to process swipe. Please try again.");
      }
    }
  };

  const closeMatchModal = () => {
    setShowMatchModal(false);
    setMatchedUser(null);
  };

  const goToChat = () => {
    closeMatchModal();
    // Navigate to chat with the matched user
    navigate(`/chat/${matchedUser._id || matchedUser.id}`);
  };

  const handleRewind = async () => {
    try {
      const response = await swipeService.undoLastSwipe();
      if (response.success) {
        // Move back one user if possible
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          setSwipeDirection(null);

          // Remove from liked/passed arrays if they exist
          const prevUserId =
            users[currentIndex - 1]?._id || users[currentIndex - 1]?.id;
          setLikedUsers((prev) => prev.filter((id) => id !== prevUserId));
          setPassedUsers((prev) => prev.filter((id) => id !== prevUserId));
        }
      }
    } catch (error) {
      console.error("Rewind failed:", error);
      alert("Failed to undo last swipe. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading profiles...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={fetchDiscoverUsers} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (users.length === 0 || currentIndex >= users.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-12 h-12 text-white" fill="white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No more profiles
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Check back later for new matches!
          </p>
          <div className="space-y-3">
            <button onClick={fetchDiscoverUsers} className="btn-primary w-full">
              Refresh
            </button>
            <button
              onClick={() => navigate("/who-liked-me")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              Who Liked Me 💕
            </button>
            <button
              onClick={() => navigate("/who-i-liked")}
              className="w-full bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-700 px-4 py-3 rounded-xl font-semibold transition-all"
            >
              See Who I Liked 💭
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:bg-dark-950 py-6 px-4">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Discover Love ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Swipe to find your perfect match
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative mb-6" style={{ height: "500px" }}>
          {/* Next card (behind) */}
          {users[currentIndex + 1] && (
            <div
              className="absolute w-full h-full"
              style={{
                transform: "scale(0.95) translateY(8px)",
                opacity: 0.3,
                zIndex: 1,
              }}
            >
              <UserCard
                user={users[currentIndex + 1]}
                className="compact-swipe-card"
              />
            </div>
          )}

          {/* Current card */}
          <div className="relative w-full h-full" style={{ zIndex: 2 }}>
            {currentUser && (
              <UserCard
                user={currentUser}
                className={`compact-swipe-card ${
                  swipeDirection === "left" ? "swipe-left" : ""
                } ${swipeDirection === "right" ? "swipe-right" : ""}`}
              />
            )}
          </div>

          {/* Swipe Indicators */}
          {swipeDirection === "right" && (
            <div className="absolute top-8 right-4 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold text-lg rotate-12 shadow-xl z-20 animate-scale-in">
              LIKE ❤️
            </div>
          )}
          {swipeDirection === "left" && (
            <div className="absolute top-8 left-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold text-lg -rotate-12 shadow-xl z-20 animate-scale-in">
              PASS 👎
            </div>
          )}
          {swipeDirection === "super" && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold text-lg shadow-xl z-20 animate-scale-in">
              SUPER ⭐
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center space-x-3 mb-6">
          {/* Rewind Button */}
          <button
            onClick={handleRewind}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Pass Button */}
          <button
            onClick={() => handleSwipe("left")}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-500 text-white hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl"
          >
            <X className="w-7 h-7" strokeWidth={2.5} />
          </button>

          {/* Super Like Button */}
          <button
            onClick={() => handleSwipe("super")}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <Star className="w-5 h-5" fill="currentColor" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => handleSwipe("right")}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl"
          >
            <Heart className="w-7 h-7" fill="currentColor" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/70 dark:bg-dark-800/70 backdrop-blur-sm rounded-2xl p-3 text-center shadow-lg border border-white/20">
            <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {likedUsers.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Liked
            </div>
          </div>
          <div className="bg-white/70 dark:bg-dark-800/70 backdrop-blur-sm rounded-2xl p-3 text-center shadow-lg border border-white/20">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {users.length - currentIndex}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Remaining
            </div>
          </div>
          <div className="bg-white/70 dark:bg-dark-800/70 backdrop-blur-sm rounded-2xl p-3 text-center shadow-lg border border-white/20">
            <div className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              {passedUsers.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Passed
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white/70 dark:bg-dark-800/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm flex items-center">
            💡 Quick Tips
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Tap left/right side of photo to navigate</li>
            <li>• Click info button for full profile details</li>
            <li>• Use Super Like to stand out!</li>
          </ul>
        </div>
      </div>

      {/* Like Animation Overlay */}
      {showLikeAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-green-500 text-white px-8 py-4 rounded-full text-2xl font-bold animate-bounce">
            💚 LIKED!
          </div>
        </div>
      )}

      {/* Match Modal */}
      {showMatchModal && matchedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-pink-600 mb-2">
                It's a Match!
              </h2>
              <p className="text-gray-600">
                You and {matchedUser.name} liked each other
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="flex space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-200">
                  <img
                    src={matchedUser.photos?.[0] || "/default-avatar.png"}
                    alt="Your photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center">
                  <div className="text-pink-500 text-2xl">💕</div>
                </div>
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-200">
                  <img
                    src={matchedUser.photos?.[0] || "/default-avatar.png"}
                    alt={matchedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={goToChat}
                className="w-full bg-pink-500 text-white py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors"
              >
                Send a Message
              </button>
              <button
                onClick={closeMatchModal}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
