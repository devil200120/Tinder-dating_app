import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Users,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../context/ChatContext";
import Avatar from "./Avatar";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useChat();

  const navItems = [
    {
      path: "/discover",
      icon: Heart,
      label: "Discover",
      description: "Find your match",
    },
    {
      path: "/matches",
      icon: Users,
      label: "Matches",
      description: "Your connections",
    },
    {
      path: "/chats",
      icon: MessageCircle,
      label: "Chats",
      description: "Messages",
      badge: unreadCount,
    },
    {
      path: "/profile",
      icon: User,
      label: "Profile",
      description: "Edit profile",
    },
    {
      path: "/settings",
      icon: Settings,
      label: "Settings",
      description: "Preferences",
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      onClose?.();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-dark-800 shadow-2xl z-50 transition-transform duration-300 w-80 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/discover"
                className="flex items-center space-x-2"
                onClick={onClose}
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-xl">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                  Amore
                </span>
              </Link>

              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            {user && (
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
              >
                <Avatar
                  src={user.images?.[0]}
                  alt={user.name}
                  size="lg"
                  online={true}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    View profile
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    active
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  }`}
                >
                  <Icon
                    className="w-5 h-5"
                    fill={active ? "currentColor" : "none"}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p
                      className={`text-xs ${
                        active
                          ? "text-white/80"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                  {item.badge > 0 && (
                    <span className="bg-white text-primary-600 text-xs font-bold rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
