import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { interestOptions } from '../utils/mockData';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    photos: [],
    location: '',
    bio: '',
    interests: [],
    lookingFor: '',
    ageRange: [24, 32],
    distance: 25
  });
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else if (prev.interests.length < 10) {
        return { ...prev, interests: [...prev.interests, interest] };
      }
      return prev;
    });
  };

  const handleComplete = async () => {
    setIsLoading(true);
    const result = await completeOnboarding(formData);
    if (result.success) {
      navigate('/discover');
    }
    setIsLoading(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.photos.length >= 2;
      case 2:
        return formData.location && formData.bio.trim();
      case 3:
        return formData.interests.length >= 3;
      case 4:
        return formData.lookingFor;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-white font-medium">Step {step} of {totalSteps}</span>
            <span className="text-white/70">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="card p-8 animate-scale-in">
          {/* Step 1: Photos */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <Camera className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Add Your Photos
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload at least 2 photos to get started
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="aspect-square border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl flex flex-col items-center justify-center hover:border-primary-500 transition-colors cursor-pointer"
                  >
                    {formData.photos[index] ? (
                      <img
                        src={formData.photos[index]}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-400">
                          {index === 0 ? 'Main Photo' : `Photo ${index + 1}`}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                This is a demo. In production, photos would be uploaded here.
              </p>
            </div>
          )}

          {/* Step 2: Location & Bio */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <MapPin className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  About You
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Tell us a bit about yourself
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows="5"
                    maxLength="500"
                    className="input-field resize-none"
                    placeholder="Tell us about yourself, your interests, what makes you unique..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Your Interests
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select at least 3 interests (up to 10)
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {interestOptions.map((interest) => {
                  const isSelected = formData.interests.includes(interest);
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

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {formData.interests.length}/10 interests selected
              </p>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Dating Preferences
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Help us find your perfect match
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Looking for
                  </label>
                  <select
                    value={formData.lookingFor}
                    onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select...</option>
                    <option value="relationship">Long-term relationship</option>
                    <option value="dating">Casual dating</option>
                    <option value="friends">New friends</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Age Range: {formData.ageRange[0]} - {formData.ageRange[1]}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="18"
                      max="100"
                      value={formData.ageRange[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ageRange: [parseInt(e.target.value), formData.ageRange[1]]
                        })
                      }
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="18"
                      max="100"
                      value={formData.ageRange[1]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ageRange: [formData.ageRange[0], parseInt(e.target.value)]
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Distance: {formData.distance} miles
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.distance}
                    onChange={(e) =>
                      setFormData({ ...formData, distance: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-secondary flex items-center space-x-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{step === totalSteps ? (isLoading ? 'Completing...' : 'Complete') : 'Continue'}</span>
              {step < totalSteps && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
