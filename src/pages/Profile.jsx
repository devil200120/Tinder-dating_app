import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Edit,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  ArrowLeft,
  Star,
  Camera,
  Shield,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../context/ChatContext";
import { userService } from "../services/userService";
import { useToast } from "../context/ToastContext";
import ProfileForm from "../components/ProfileForm";
import Avatar from "../components/Avatar";
import BlockUserModal from "../components/BlockUserModal";

const Profile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile } = useAuth();
  const { getUserById } = useChat();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockStatus, setBlockStatus] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === "me";
  const profileUser = isOwnProfile
    ? currentUser
    : location.state?.user || getUserById(parseInt(userId));

  // Extract images from photos array
  const userImages = profileUser?.photos?.map((photo) => photo.url) || [];

  useEffect(() => {
    if (!isOwnProfile && profileUser?._id) {
      checkBlockStatus();
    }
  }, [isOwnProfile, profileUser?._id]);

  const checkBlockStatus = async () => {
    try {
      const response = await userService.checkBlockStatus(profileUser._id);
      setBlockStatus(response.data);
    } catch (error) {
      console.error("Failed to check block status:", error);
    }
  };

  const handleUserBlocked = (blockData) => {
    setBlockStatus({
      isBlocked: true,
      isBlockedBy: false,
      blockType: blockData.blockType,
      blockedAt: blockData.createdAt,
    });
    showToast("User has been blocked successfully", "success");
    navigate("/blocked-users");
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (updatedData) => {
    const result = await updateProfile(updatedData);
    if (result.success) {
      setIsEditing(false);
    }
    return result; // Return the result so ProfileForm can access it
  };

  const handleMessageClick = () => {
    navigate(`/chats/${profileUser.id}`);
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Profile</span>
            </button>
          </div>

          <div className="card p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Edit Profile
            </h1>
            <ProfileForm
              user={profileUser}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        {!isOwnProfile && (
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="card overflow-hidden sticky top-8">
              {/* Main Image */}
              <div className="relative aspect-[3/4]">
                {userImages.length > 0 ? (
                  <img
                    src={userImages[selectedImageIndex] || userImages[0]}
                    alt={profileUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        profileUser.name
                      )}&size=400&background=e11d48&color=fff`;
                    }}
                    onLoad={() => {
                      console.log(
                        "Image loaded successfully:",
                        userImages[selectedImageIndex] || userImages[0]
                      );
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-3 opacity-60" />
                      <p className="text-lg font-semibold mb-1">
                        {profileUser.name}
                      </p>
                      <p className="text-sm opacity-80">No photos uploaded</p>
                    </div>
                  </div>
                )}
                {profileUser.verified && (
                  <div className="absolute top-4 right-4 bg-blue-500 p-2 rounded-full shadow-lg">
                    <Star className="w-5 h-5 text-white" fill="white" />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {userImages.length > 1 && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-dark-700">
                  {userImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        selectedImageIndex === index
                          ? "ring-2 ring-primary-500"
                          : "opacity-70 hover:opacity-100"
                      } transition-all`}
                    >
                      <img
                        src={image}
                        alt={`${profileUser.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            profileUser.name
                          )}&size=200&background=e11d48&color=fff`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {isOwnProfile ? (
                <div className="p-4">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                    }}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {!blockStatus?.isBlocked && !blockStatus?.isBlockedBy && (
                    <button
                      onClick={handleMessageClick}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Message</span>
                    </button>
                  )}

                  {blockStatus?.isBlocked && (
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <Shield className="w-6 h-6 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        User is blocked
                      </p>
                    </div>
                  )}

                  {blockStatus?.isBlockedBy && (
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Shield className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        This user has blocked you
                      </p>
                    </div>
                  )}

                  {/* Options Menu */}
                  {!blockStatus?.isBlockedBy && (
                    <div className="relative">
                      <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="btn-secondary w-full flex items-center justify-center space-x-2"
                      >
                        <MoreVertical className="w-4 h-4" />
                        <span>More Options</span>
                      </button>

                      {showOptions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-lg z-10">
                          {!blockStatus?.isBlocked && (
                            <button
                              onClick={() => {
                                setShowOptions(false);
                                setIsBlockModalOpen(true);
                              }}
                              className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 rounded-t-lg"
                            >
                              <Shield className="w-4 h-4" />
                              <span>Block User</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setShowOptions(false);
                              // Add report functionality here
                            }}
                            className="w-full px-4 py-3 text-left text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center space-x-2 rounded-b-lg"
                          >
                            <Star className="w-4 h-4" />
                            <span>Report User</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {profileUser.name}, {profileUser.age}
                  </h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-5 h-5" />
                      <span>
                        {profileUser.location?.city &&
                        profileUser.location?.country
                          ? `${profileUser.location.city}, ${profileUser.location.country}`
                          : profileUser.location?.city ||
                            profileUser.location?.address ||
                            profileUser.location?.country ||
                            "Unknown location"}
                      </span>
                    </div>
                    {profileUser.distance && (
                      <span>• {profileUser.distance} miles away</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profileUser.bio || "No bio available"}
              </p>
            </div>

            {/* Details */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Briefcase className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Occupation
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {profileUser.occupation || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <GraduationCap className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Education
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {profileUser.education || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Gender
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium capitalize">
                      {profileUser.gender || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interests */}
            {profileUser.interests && profileUser.interests.length > 0 && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profileUser.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences (only for own profile) */}
            {isOwnProfile && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Dating Preferences
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Looking for
                    </span>
                    <span className="font-medium">
                      {profileUser.preferences?.lookingFor || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Age range
                    </span>
                    <span className="font-medium">
                      {profileUser.preferences?.ageRange?.min &&
                      profileUser.preferences?.ageRange?.max
                        ? `${profileUser.preferences.ageRange.min} - ${profileUser.preferences.ageRange.max}`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Distance
                    </span>
                    <span className="font-medium">
                      {profileUser.preferences?.distanceRange
                        ? `Within ${profileUser.preferences.distanceRange} km`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Gender preference
                    </span>
                    <span className="font-medium capitalize">
                      {profileUser.genderPreference?.join(", ") || "Not set"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block User Modal */}
      <BlockUserModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        user={profileUser}
        onUserBlocked={handleUserBlocked}
      />
    </div>
  );
};

export default Profile;
