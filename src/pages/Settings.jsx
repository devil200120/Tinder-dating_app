import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Eye,
  Heart,
  HelpCircle,
  ChevronRight,
  Globe,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, logout, updateProfile } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    likes: true,
    promotions: false,
  });

  const [privacy, setPrivacy] = useState({
    showOnline: true,
    showDistance: true,
    showAge: true,
    incognito: false,
  });

  const [preferences, setPreferences] = useState({
    ageMin: user?.preferences?.ageRange[0] || 24,
    ageMax: user?.preferences?.ageRange[1] || 32,
    distance: user?.preferences?.distance || 25,
    showMe: user?.preferences?.showMe || "everyone",
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  const handleSavePreferences = async () => {
    await updateProfile({
      preferences: {
        ...user.preferences,
        ageRange: [preferences.ageMin, preferences.ageMax],
        distance: preferences.distance,
        showMe: preferences.showMe,
      },
    });
    alert("Preferences saved!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and app preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <User className="w-5 h-5 text-primary-500" />
                <span>Account</span>
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
              <button
                onClick={() => navigate("/profile")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                <span className="text-gray-900 dark:text-white">
                  Edit Profile
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <span className="text-gray-900 dark:text-white">
                  Change Password
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <span className="text-gray-900 dark:text-white">
                  Email & Phone
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Discovery Preferences */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-6">
              <Heart className="w-5 h-5 text-primary-500" />
              <span>Discovery Preferences</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Show Me
                </label>
                <select
                  value={preferences.showMe}
                  onChange={(e) =>
                    setPreferences({ ...preferences, showMe: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="everyone">Everyone</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Age Range: {preferences.ageMin} - {preferences.ageMax}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={preferences.ageMin}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        ageMin: parseInt(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={preferences.ageMax}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        ageMax: parseInt(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Distance: {preferences.distance} miles
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={preferences.distance}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      distance: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <button
                onClick={handleSavePreferences}
                className="btn-primary w-full"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-6">
              <Bell className="w-5 h-5 text-primary-500" />
              <span>Notifications</span>
            </h2>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {key === "matches" && "Get notified about new matches"}
                      {key === "messages" && "Get notified about new messages"}
                      {key === "likes" && "Get notified when someone likes you"}
                      {key === "promotions" && "Receive promotional offers"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          [key]: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-600 peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Safety */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-6">
              <Shield className="w-5 h-5 text-primary-500" />
              <span>Privacy & Safety</span>
            </h2>

            <div className="space-y-4">
              {Object.entries(privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {key === "showOnline" &&
                        "Let others see when you're online"}
                      {key === "showDistance" && "Show your distance to others"}
                      {key === "showAge" && "Display your age on your profile"}
                      {key === "incognito" && "Browse anonymously"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setPrivacy({ ...privacy, [key]: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-600 peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              ))}

              {/* Blocked Users Link */}
              <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                <button
                  onClick={() => navigate("/blocked-users")}
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-red-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Blocked Users
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage users you've blocked
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Eye className="w-5 h-5 text-primary-500" />
                <span>Appearance</span>
              </h2>
            </div>
            <button
              onClick={toggleTheme}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="text-gray-900 dark:text-white">
                  {isDarkMode ? "Dark" : "Light"} Mode
                </span>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  isDarkMode ? "bg-primary-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                    isDarkMode ? "translate-x-6" : "translate-x-0.5"
                  } mt-0.5`}
                />
              </div>
            </button>
          </div>

          {/* Support */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-primary-500" />
                <span>Support</span>
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <span className="text-gray-900 dark:text-white">
                  Help Center
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <span className="text-gray-900 dark:text-white">
                  Safety Tips
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <span className="text-gray-900 dark:text-white">
                  Terms of Service
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <span className="text-gray-900 dark:text-white">
                  Privacy Policy
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="card">
            <button
              onClick={handleLogout}
              className="w-full p-4 flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Log Out</span>
            </button>
          </div>

          {/* App Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            <p>Amore Dating App v1.0.0</p>
            <p className="mt-1">© 2024 Amore. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
