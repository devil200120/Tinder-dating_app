import React, { useState, useEffect } from "react";
import { Heart, X, Star, RotateCcw } from "lucide-react";
import UserCard from "../components/UserCard";
import { mockUsers } from "../utils/mockData";
import { useChat } from "../hooks/useChat";
import { shuffleArray } from "../utils/helpers";

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);
  const [passedUsers, setPassedUsers] = useState([]);
  const { addMatch } = useChat();

  useEffect(() => {
    // Shuffle users for variety
    setUsers(shuffleArray(mockUsers));
  }, []);

  const currentUser = users[currentIndex];

  const handleSwipe = (direction) => {
    if (!currentUser) return;

    setSwipeDirection(direction);

    if (direction === "right" || direction === "super") {
      setLikedUsers([...likedUsers, currentUser.id]);

      // Simulate match (50% chance)
      if (Math.random() > 0.5) {
        setTimeout(() => {
          showMatchNotification(currentUser);
          addMatch(currentUser);
        }, 300);
      }
    } else if (direction === "left") {
      setPassedUsers([...passedUsers, currentUser.id]);
    }

    setTimeout(() => {
      if (currentIndex < users.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
        setUsers(shuffleArray(mockUsers));
      }
      setSwipeDirection(null);
    }, 300);
  };

  const showMatchNotification = (user) => {
    // In a real app, this would show a match modal
    console.log(`It's a match with ${user.name}!`);
    alert(`🎉 It's a match with ${user.name}!`);
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSwipeDirection(null);
    }
  };

  if (!currentUser) {
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
          <button
            onClick={() => {
              setCurrentIndex(0);
              setUsers(shuffleArray(mockUsers));
            }}
            className="btn-primary"
          >
            Start Over
          </button>
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
            <UserCard
              user={currentUser}
              className={`compact-swipe-card ${
                swipeDirection === "left" ? "swipe-left" : ""
              } ${swipeDirection === "right" ? "swipe-right" : ""}`}
            />
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
    </div>
  );
};

export default Discover;
