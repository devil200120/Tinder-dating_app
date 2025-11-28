import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Users,
  User,
  Settings,
  Moon,
  Sun,
  Clock,
  HeartHandshake,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useChat } from "../context/ChatContext";
import Avatar from "./Avatar";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { unreadCount } = useChat();
  const { user } = useAuth();

  const navItems = [
    { path: "/discover", icon: Heart, label: "Discover" },
    { path: "/matches", icon: Users, label: "Matches" },
    { path: "/who-liked-me", icon: HeartHandshake, label: "Like Me Back" },
    { path: "/who-i-liked", icon: Clock, label: "My Likes" },
    { path: "/chats", icon: MessageCircle, label: "Chats", badge: unreadCount },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-dark-800 shadow-lg border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/discover" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Amore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    active
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700"
                  }`}
                >
                  <Icon
                    className="w-5 h-5"
                    fill={active ? "currentColor" : "none"}
                  />
                  <span className="font-medium">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>

            {/* User Avatar */}
            {user && (
              <Link to="/profile">
                <Avatar
                  src={user.images?.[0]}
                  alt={user.name}
                  size="md"
                  online={true}
                  className="cursor-pointer hover:ring-2 hover:ring-primary-500 rounded-full transition-all duration-300"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-dark-700">
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  active
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <Icon
                  className="w-6 h-6"
                  fill={active ? "currentColor" : "none"}
                />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
