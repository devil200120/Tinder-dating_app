import React, { useState } from "react";
import { Camera, X, Plus, MapPin } from "lucide-react";
import { interestOptions } from "../utils/mockData";
import { useToast } from "../context/ToastContext";
import LocationInput from "./LocationInput";

const ProfileForm = ({ user, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "",
    genderPreference: user?.genderPreference || ["everyone"],
    bio: user?.bio || "",
    occupation: user?.occupation || "",
    education: user?.education || "",
    interests: user?.interests || [],
    location: {
      city: user?.location?.city || "",
      country: user?.location?.country || "",
      address: user?.location?.address || "",
      coordinates: user?.location?.coordinates || [0, 0],
    },
    preferences: {
      ageRange: {
        min: user?.preferences?.ageRange?.min || 18,
        max: user?.preferences?.ageRange?.max || 100,
      },
      distanceRange: user?.preferences?.distanceRange || 50,
      lookingFor: user?.preferences?.lookingFor || "dating",
    },
    photos: user?.photos || [],
  });

  const [selectedInterests, setSelectedInterests] = useState(
    user?.interests || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-binary" },
    { value: "other", label: "Other" },
  ];

  const genderPreferenceOptions = [
    { value: "male", label: "Men" },
    { value: "female", label: "Women" },
    { value: "non-binary", label: "Non-binary" },
    { value: "everyone", label: "Everyone" },
  ];

  const lookingForOptions = [
    { value: "friendship", label: "Friendship" },
    { value: "dating", label: "Dating" },
    { value: "relationship", label: "Relationship" },
    { value: "casual", label: "Casual" },
    { value: "marriage", label: "Marriage" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");
      if (grandchild) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLocationChange = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        city: locationData.city || "",
        area: locationData.area || "",
        mainCity: locationData.mainCity || "",
        state: locationData.state || "",
        country: locationData.country || "",
        address: locationData.address || "",
        coordinates: locationData.coordinates || [0, 0],
        placeId: locationData.placeId || "",
      },
    }));
  };

  const handleGenderPreferenceChange = (gender) => {
    setFormData((prev) => {
      let newPreferences = [...prev.genderPreference];
      if (gender === "everyone") {
        newPreferences = ["everyone"];
      } else {
        newPreferences = newPreferences.filter((g) => g !== "everyone");
        if (newPreferences.includes(gender)) {
          newPreferences = newPreferences.filter((g) => g !== gender);
        } else {
          newPreferences.push(gender);
        }
        if (newPreferences.length === 0) {
          newPreferences = ["everyone"];
        }
      }
      return {
        ...prev,
        genderPreference: newPreferences,
      };
    });
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setUploadingPhoto(true);

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append("photos", file);

      // Upload to backend
      const response = await fetch("http://localhost:5000/api/users/photos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: uploadFormData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Backend returns the entire photos array, so replace the current array
          setFormData((prev) => ({
            ...prev,
            photos: result.data,
          }));
          toast.success("Photo uploaded successfully!");
        } else {
          toast.error("Failed to upload photo");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to upload photo");
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
      // Reset the input
      event.target.value = "";
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      } else if (prev.length < 10) {
        return [...prev, interest];
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedData = {
        ...formData,
        interests: selectedInterests,
      };

      const result = await onSave(updatedData);

      if (result && result.success) {
        toast.success("Profile updated successfully!", {
          duration: 3000,
        });
      } else {
        toast.error(
          result?.message || "Failed to update profile. Please try again.",
          {
            duration: 4000,
          }
        );
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        "An error occurred while updating your profile. Please try again.",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photos Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Photos (up to 6)
        </label>
        <div className="grid grid-cols-3 gap-4">
          {formData.photos.map((photo, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={photo.url}
                alt={`Profile ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    photos: prev.photos.filter((_, i) => i !== index),
                  }));
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {formData.photos.length < 6 && (
            <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploadingPhoto}
              />
              {uploadingPhoto ? (
                <>
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-1"></div>
                  <span className="text-xs">Uploading...</span>
                </>
              ) : (
                <>
                  <Plus className="w-8 h-8 mb-1" />
                  <span className="text-xs">Add Photo</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Age *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="18"
            max="100"
            className="input-field"
            placeholder="Your age"
          />
        </div>
      </div>

      {/* Gender Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Gender *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {genderOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, gender: option.value }))
              }
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.gender === option.value
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Preferences */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Interested in
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {genderPreferenceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleGenderPreferenceChange(option.value)}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.genderPreference.includes(option.value)
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          <MapPin className="w-4 h-4 inline mr-1" />
          Location
        </label>
        <LocationInput
          value={formData.location}
          onChange={handleLocationChange}
          placeholder="Enter your city or address"
        />

        {/* Show current location details */}
        {formData.location.coordinates[0] !== 0 &&
          formData.location.coordinates[1] !== 0 && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">
                <span className="font-medium">Location confirmed:</span>{" "}
                {formData.location.address}
              </p>
              {formData.location.area && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Area: {formData.location.area}
                </p>
              )}
              {formData.location.mainCity && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  City: {formData.location.mainCity}, {formData.location.state},{" "}
                  {formData.location.country}
                </p>
              )}
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Coordinates: {formData.location.coordinates[1].toFixed(6)},{" "}
                {formData.location.coordinates[0].toFixed(6)}
              </p>
            </div>
          )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Bio *
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
          rows="4"
          maxLength="500"
          className="input-field resize-none"
          placeholder="Tell us about yourself..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formData.bio.length}/500 characters
        </p>
      </div>

      {/* Occupation & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="input-field"
            placeholder="Your job title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Education
          </label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="input-field"
            placeholder="Your school/university"
          />
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Interests (select up to 10)
        </label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {selectedInterests.length}/10 interests selected
        </p>
      </div>

      {/* Looking For */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Looking for
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {lookingForOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    lookingFor: option.value,
                  },
                }))
              }
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.preferences.lookingFor === option.value
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Age Preferences */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Age Preference
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Minimum Age: {formData.preferences.ageRange.min}
            </label>
            <input
              type="range"
              name="preferences.ageRange.min"
              value={formData.preferences.ageRange.min}
              onChange={handleChange}
              min="18"
              max="100"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Maximum Age: {formData.preferences.ageRange.max}
            </label>
            <input
              type="range"
              name="preferences.ageRange.max"
              value={formData.preferences.ageRange.max}
              onChange={handleChange}
              min="18"
              max="100"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Distance Preference */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Distance Preference: {formData.preferences.distanceRange} km
        </label>
        <input
          type="range"
          name="preferences.distanceRange"
          value={formData.preferences.distanceRange}
          onChange={handleChange}
          min="1"
          max="500"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>1 km</span>
          <span>500 km</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary px-8"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
