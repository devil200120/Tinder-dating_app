import React from "react";
import { Menu, X, Heart } from "lucide-react";

const MobileMenu = ({ isOpen, onToggle, onClose }) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <div className="fixed top-0 right-0 z-50 w-80 h-full bg-white dark:bg-dark-900 shadow-xl transform transition-transform duration-300 md:hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    LoveConnect
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-8">
                <ul className="space-y-6">
                  <li>
                    <a
                      href="#features"
                      onClick={onClose}
                      className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#testimonials"
                      onClick={onClose}
                      className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      Success Stories
                    </a>
                  </li>
                  <li>
                    <a
                      href="#download"
                      onClick={onClose}
                      className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      Download
                    </a>
                  </li>
                </ul>
              </nav>

              {/* CTA Buttons */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <a
                    href="/login"
                    onClick={onClose}
                    className="block w-full text-center py-3 px-4 bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    onClick={onClose}
                    className="block w-full text-center py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;
