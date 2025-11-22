import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Edit, MapPin, Briefcase, GraduationCap, Heart,
  MessageCircle, ArrowLeft, Star, Camera
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import ProfileForm from '../components/ProfileForm';
import Avatar from '../components/Avatar';

const Profile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile } = useAuth();
  const { getUserById } = useChat();
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === 'me';
  const profileUser = isOwnProfile 
    ? currentUser 
    : location.state?.user || getUserById(parseInt(userId));

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profile not found
          </h2>
          <button onClick={() => navigate(-1)} className="btn-primary mt-4">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (updatedData) => {
    const result = await updateProfile(updatedData);
    if (result.success) {
      setIsEditing(false);
    }
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
                <img
                  src={profileUser.images?.[selectedImageIndex] || profileUser.images?.[0]}
                  alt={profileUser.name}
                  className="w-full h-full object-cover"
                />
                {profileUser.verified && (
                  <div className="absolute top-4 right-4 bg-blue-500 p-2 rounded-full shadow-lg">
                    <Star className="w-5 h-5 text-white" fill="white" />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {profileUser.images && profileUser.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-dark-700">
                  {profileUser.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        selectedImageIndex === index
                          ? 'ring-2 ring-primary-500'
                          : 'opacity-70 hover:opacity-100'
                      } transition-all`}
                    >
                      <img
                        src={image}
                        alt={`${profileUser.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {isOwnProfile ? (
                <div className="p-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <button
                    onClick={handleMessageClick}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Message</span>
                  </button>
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
                      <span>{profileUser.location}</span>
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
                {profileUser.bio}
              </p>
            </div>

            {/* Details */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Details
              </h2>
              <div className="space-y-4">
                {profileUser.occupation && (
                  <div className="flex items-start space-x-3">
                    <Briefcase className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Occupation</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profileUser.occupation}
                      </p>
                    </div>
                  </div>
                )}
                {profileUser.education && (
                  <div className="flex items-start space-x-3">
                    <GraduationCap className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Education</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profileUser.education}
                      </p>
                    </div>
                  </div>
                )}
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
            {isOwnProfile && profileUser.preferences && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Dating Preferences
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Looking for</span>
                    <span className="font-medium">{profileUser.preferences.lookingFor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Age range</span>
                    <span className="font-medium">
                      {profileUser.preferences.ageRange[0]} - {profileUser.preferences.ageRange[1]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Distance</span>
                    <span className="font-medium">Within {profileUser.preferences.distance} miles</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
