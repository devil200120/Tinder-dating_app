import React, { useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";

const MobileMenu = ({ isOpen, onToggle, onClose }) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="md:hidden p-2 rounded-lg text-white hover:text-pink-300 transition-all duration-300 hover:bg-white/10 relative"
        style={{ zIndex: 2147483647 }}
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div
            className={`absolute transition-all duration-300 ${
              isOpen
                ? "opacity-0 rotate-45 scale-75"
                : "opacity-100 rotate-0 scale-100"
            }`}
          >
            <Menu className="w-6 h-6" />
          </div>
          <div
            className={`absolute transition-all duration-300 ${
              isOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-45 scale-75"
            }`}
          >
            <X className="w-6 h-6" />
          </div>
        </div>
      </button>

      {/* Mobile menu overlay and panel */}
      {isOpen && (
        <div className="fixed inset-0 md:hidden" style={{ zIndex: 2147483646 }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div
            className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl border-l border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
              </div>

              {/* Header */}
              <div className="relative z-10 flex items-center justify-center p-6 border-b border-white/20 backdrop-blur-sm bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      LoveConnect
                    </h2>
                    <p className="text-xs text-gray-300">Find Your Soulmate</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-8 relative z-10">
                <div className="space-y-2">
                  <a
                    href="#features"
                    onClick={onClose}
                    className="flex items-center space-x-4 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group transform hover:translate-x-2"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      ✨
                    </span>
                    <span className="text-lg font-medium">Features</span>
                  </a>
                  <a
                    href="#testimonials"
                    onClick={onClose}
                    className="flex items-center space-x-4 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group transform hover:translate-x-2"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      💕
                    </span>
                    <span className="text-lg font-medium">Success Stories</span>
                  </a>
                  <a
                    href="#download"
                    onClick={onClose}
                    className="flex items-center space-x-4 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group transform hover:translate-x-2"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      📱
                    </span>
                    <span className="text-lg font-medium">Download</span>
                  </a>
                  <a
                    href="#about"
                    onClick={onClose}
                    className="flex items-center space-x-4 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group transform hover:translate-x-2"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      👥
                    </span>
                    <span className="text-lg font-medium">About Us</span>
                  </a>
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                {/* Additional Links */}
                <div className="space-y-2">
                  <a
                    href="#help"
                    onClick={onClose}
                    className="flex items-center space-x-4 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="text-2xl">🤝</span>
                    <span className="text-lg font-medium">Help & Support</span>
                  </a>
                  <a
                    href="#privacy"
                    onClick={onClose}
                    className="flex items-center space-x-4 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="text-2xl">🔒</span>
                    <span className="text-lg font-medium">Privacy Policy</span>
                  </a>
                </div>
              </nav>

              {/* CTA Buttons */}
              <div className="p-6 border-t border-white/20 backdrop-blur-sm bg-white/5 relative z-10">
                <div className="space-y-4">
                  <a
                    href="/login"
                    onClick={onClose}
                    className="block w-full text-center py-4 px-6 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    onClick={onClose}
                    className="block w-full text-center py-4 px-6 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25"
                  >
                    Get Started Free ✨
                  </a>
                </div>

                {/* App Store Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-all duration-300">
                    <span className="text-lg">📱</span>
                    <span>App Store</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-all duration-300">
                    <span className="text-lg">🤖</span>
                    <span>Play Store</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
