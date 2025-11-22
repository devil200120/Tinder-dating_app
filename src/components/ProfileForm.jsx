import React, { useState } from 'react';
import { Camera, X, Plus } from 'lucide-react';
import { interestOptions } from '../utils/mockData';

const ProfileForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    bio: user?.bio || '',
    occupation: user?.occupation || '',
    education: user?.education || '',
    interests: user?.interests || [],
    images: user?.images || []
  });

  const [selectedInterests, setSelectedInterests] = useState(user?.interests || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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

    const updatedData = {
      ...formData,
      interests: selectedInterests
    };

    await onSave(updatedData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photos Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Photos (up to 6)
        </label>
        <div className="grid grid-cols-3 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={image}
                alt={`Profile ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index)
                  }));
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {formData.images.length < 6 && (
            <button
              type="button"
              className="aspect-square border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all"
            >
              <Plus className="w-8 h-8 mb-1" />
              <span className="text-xs">Add Photo</span>
            </button>
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
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
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

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
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
