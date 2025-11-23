// components/SwipeCard.jsx
import React, { useState, useRef } from "react";
import { Heart, X, Star, RotateCcw, Info } from "lucide-react";

const SwipeCard = ({
  user,
  onSwipe,
  onSuperLike,
  onShowProfile,
  canUndo = false,
  onUndo,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  if (!user) return null;

  const photos = user.photos || [];
  const currentPhoto = photos[currentPhotoIndex]?.url || "/default-avatar.png";

  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleSwipeAction = (action) => {
    if (action === "super_like") {
      onSuperLike?.(user._id);
    } else {
      onSwipe?.(user._id, action);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Card */}
      <div
        ref={cardRef}
        className={`absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-transform duration-200 ${
          isDragging ? "scale-105" : ""
        }`}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${
            dragOffset.x * 0.1
          }deg)`,
        }}
      >
        {/* Photo Section */}
        <div className="relative h-3/4 bg-gray-200">
          <img
            src={currentPhoto}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />

          {/* Photo Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                disabled={currentPhotoIndex === 0}
              >
                ‹
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                disabled={currentPhotoIndex === photos.length - 1}
              >
                ›
              </button>

              {/* Photo Indicators */}
              <div className="absolute top-2 left-2 right-2 flex space-x-1">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-1 rounded ${
                      index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Profile Info Button */}
          <button
            onClick={() => onShowProfile?.(user)}
            className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <Info className="w-5 h-5 text-gray-700" />
          </button>

          {/* Age Badge */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {user.age}
          </div>
        </div>

        {/* User Info Section */}
        <div className="p-4 h-1/4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              {user.occupation && (
                <p className="text-gray-600 text-sm">{user.occupation}</p>
              )}
              {user.location?.city && (
                <p className="text-gray-500 text-xs">📍 {user.location.city}</p>
              )}
            </div>
          </div>

          {user.bio && (
            <p className="text-gray-700 text-sm mt-2 line-clamp-2">
              {user.bio}
            </p>
          )}

          {user.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {user.interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
              {user.interests.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{user.interests.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Swipe Indicators */}
        {Math.abs(dragOffset.x) > 50 && (
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              dragOffset.x > 0 ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            <div
              className={`text-6xl font-bold ${
                dragOffset.x > 0 ? "text-green-500" : "text-red-500"
              } transform rotate-12`}
            >
              {dragOffset.x > 0 ? "LIKE" : "NOPE"}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          onClick={() => handleSwipeAction("dislike")}
          className="w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>

        {canUndo && (
          <button
            onClick={onUndo}
            className="w-12 h-12 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        )}

        <button
          onClick={() => handleSwipeAction("super_like")}
          className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <Star className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleSwipeAction("like")}
          className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <Heart className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SwipeCard;
