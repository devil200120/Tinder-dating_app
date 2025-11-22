import React, { useState } from "react";
import { MapPin, Briefcase, GraduationCap, Star, Info } from "lucide-react";

const UserCard = ({ user, onSwipe, style, className = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleImageClick = (e) => {
    const cardWidth = e.currentTarget.offsetWidth;
    const clickX = e.nativeEvent.offsetX;

    if (clickX > cardWidth / 2) {
      // Clicked right side - next image
      setCurrentImageIndex((prev) =>
        prev < user.images.length - 1 ? prev + 1 : prev
      );
    } else {
      // Clicked left side - previous image
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  return (
    <div className={`compact-swipe-card ${className}`} style={style}>
      {/* Image Container */}
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={user.images[currentImageIndex]}
          alt={user.name}
          className="w-full h-full object-cover"
          draggable="false"
        />

        {/* Image Indicators */}
        <div className="absolute top-3 left-3 right-3 flex space-x-1 z-10">
          {user.images.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Verified Badge */}
        {user.verified && (
          <div className="absolute top-3 right-3 bg-blue-500 p-1.5 rounded-full shadow-lg z-10">
            <Star className="w-3 h-3 text-white" fill="white" />
          </div>
        )}

        {/* Info Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className="absolute bottom-3 right-3 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
        >
          <Info className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold font-display flex items-center space-x-2">
                <span>
                  {user.name}, {user.age}
                </span>
              </h2>
              <div className="flex items-center space-x-1 text-xs mt-0.5 opacity-90">
                <MapPin className="w-3 h-3" />
                <span>
                  {user.location} • {user.distance} miles away
                </span>
              </div>
            </div>
          </div>

          {!showDetails && (
            <>
              <p className="text-xs opacity-90 mb-2 line-clamp-2 leading-relaxed">
                {user.bio}
              </p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-1 mb-2">
                <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                  <Briefcase className="w-3 h-3" />
                  <span>{user.occupation}</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                  <GraduationCap className="w-3 h-3" />
                  <span>{user.education}</span>
                </div>
              </div>

              {/* Interests Preview */}
              <div className="flex flex-wrap gap-1">
                {user.interests.slice(0, 3).map((interest, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium border border-white/30"
                  >
                    {interest}
                  </span>
                ))}
                {user.interests.length > 3 && (
                  <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium border border-white/30">
                    +{user.interests.length - 3}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Detailed View */}
          {showDetails && (
            <div className="animate-fade-in">
              <div className="max-h-48 overflow-y-auto space-y-3 bg-black/40 backdrop-blur-md rounded-xl p-3">
                {/* About */}
                <div>
                  <h3 className="text-sm font-semibold mb-1">About</h3>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {user.bio}
                  </p>
                </div>

                {/* Occupation */}
                <div>
                  <h3 className="text-sm font-semibold mb-1 flex items-center space-x-1">
                    <Briefcase className="w-3 h-3" />
                    <span>Work</span>
                  </h3>
                  <p className="text-xs opacity-90">{user.occupation}</p>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-sm font-semibold mb-1 flex items-center space-x-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>Education</span>
                  </h3>
                  <p className="text-xs opacity-90">{user.education}</p>
                </div>

                {/* All Interests */}
                <div>
                  <h3 className="text-sm font-semibold mb-1">Interests</h3>
                  <div className="flex flex-wrap gap-1">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium border border-white/30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
