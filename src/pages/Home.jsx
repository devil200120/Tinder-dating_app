import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Sparkles,
  MessageCircle,
  Users,
  Star,
  ArrowRight,
  Play,
  Download,
  Zap,
  Shield,
  Camera,
  Globe,
  Award,
  Flame,
  Menu,
  X,
} from "lucide-react";
import MobileMenu from "../components/MobileMenu";
import SubscriptionPlans from "../components/SubscriptionPlans";

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: [0.1, 0.3], // Multiple thresholds for better detection
      rootMargin: "0px 0px -5% 0px", // Smaller margin for earlier trigger
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          if (!entry.target.classList.contains("animate-in")) {
            // Force a reflow to ensure the animation triggers
            entry.target.offsetHeight; // Force reflow
            entry.target.classList.add("animate-in");
            console.log("Observer triggered for:", entry.target.className);
            
            // Additional debugging
            const computedStyle = window.getComputedStyle(entry.target);
            console.log("Element opacity:", computedStyle.opacity);
            console.log("Element transform:", computedStyle.transform);
          }
        } else {
          // Remove animate-in when element goes out of view to allow re-animation
          if (entry.target.classList.contains("animate-in")) {
            entry.target.classList.remove("animate-in");
            console.log("Element exited view, removing animation:", entry.target.className);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Function to set up observer
    const setupObserver = () => {
      // Observe all elements with scroll animation classes
      const animatedElements = document.querySelectorAll(
        ".scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-up, .scroll-animate-fade, .scroll-animate-scale"
      );
      
      console.log("Found animated elements:", animatedElements.length);
      
      animatedElements.forEach((element) => {
        // Remove any existing animate-in class first to reset animation state
        element.classList.remove("animate-in");
        observer.observe(element);
      });
    };

    // Enhanced manual check for elements that should be visible
    const checkVisibleElements = () => {
      const animatedElements = document.querySelectorAll(
        ".scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-up, .scroll-animate-fade, .scroll-animate-scale"
      );
      
      animatedElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
        
        if (isInViewport && !element.classList.contains("animate-in")) {
          // Force a small delay to ensure CSS is ready
          requestAnimationFrame(() => {
            element.offsetHeight; // Force reflow
            element.classList.add("animate-in");
            console.log("Manual animation triggered for:", element.className.split(' ').filter(c => c.includes('scroll-animate')));
          });
        } else if (!isInViewport && element.classList.contains("animate-in")) {
          // Reset animation when element goes out of view
          element.classList.remove("animate-in");
          console.log("Manual animation reset for:", element.className.split(' ').filter(c => c.includes('scroll-animate')));
        }
      });
    };

    // Initial setup
    setupObserver();
    
    // Check visibility immediately after setup
    setTimeout(checkVisibleElements, 100);
    
    // Also check again after a longer delay for any late-loading content
    setTimeout(checkVisibleElements, 1000);
    
    // Simplified scroll handling - single event listener with proper throttling
    let scrollTimeout = null;
    let isScrolling = false;

    const handleScrollEvents = () => {
      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Mark that we're scrolling
      if (!isScrolling) {
        isScrolling = true;
      }

      // Throttled check during scrolling
      scrollTimeout = setTimeout(() => {
        checkVisibleElements();
        isScrolling = false;
      }, 100);
    };
    
    // Add single scroll event listener
    window.addEventListener('scroll', handleScrollEvents, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollEvents);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  // More dynamic and diverse images
  const heroImages = [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1400&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1400&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1522037576655-7a93ce0f4d10?w=1400&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1518621012118-1a29fb56fa03?w=1400&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511800453077-8c0afa94175f?w=1400&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=900&fit=crop&auto=format",
  ];

  const profileImages = [
    "https://images.unsplash.com/photo-1494790108755-2616b612b913?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=200&h=200&fit=crop",
  ];

  const testimonials = [
    {
      name: "Emma & Jake",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b913?w=100&h=100&fit=crop",
      story:
        "Matched on day one, engaged after 8 months! This app is pure magic ✨",
      rating: 5,
      location: "New York, NY",
    },
    {
      name: "Sofia & Marcus",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      story:
        "Found my soulmate across the world. Long distance became no distance! 💕",
      rating: 5,
      location: "Los Angeles, CA",
    },
    {
      name: "Alex & Taylor",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      story:
        "3 years together, 1000+ inside jokes, infinite love. Best decision ever! 🎉",
      rating: 5,
      location: "Miami, FL",
    },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Matches",
      description:
        "AI-powered algorithm finds your perfect match in seconds, not months.",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Video First Dating",
      description:
        "See real personalities with video profiles and instant video calls.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Verified Profiles",
      description:
        "Every profile is verified. No catfish, no fake accounts, just real people.",
      color: "from-green-400 to-blue-500",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Connections",
      description:
        "Connect with amazing people worldwide or right in your neighborhood.",
      color: "from-cyan-400 to-teal-500",
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "Hot Matches",
      description:
        "See who's interested in you right now with our real-time matching system.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Experience",
      description:
        "Award-winning app with the highest success rate in the industry.",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  // Auto-rotate hero images faster
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); // Changed to 3 seconds for more dynamic feel
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div
          className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-800 to-indigo-900"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
          }}
        />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Heart className="w-7 h-7 text-white fill-current animate-bounce" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  LoveConnect
                </span>
                <div className="text-xs text-gray-400">Find Your Soulmate</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#testimonials"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                Stories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#download"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                Download
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="hidden sm:block text-gray-300 hover:text-white transition-all duration-300 relative group"
              >
                Sign In
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/signup"
                className="hidden sm:block relative overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all transform hover:scale-110 shadow-2xl hover:shadow-pink-500/25 group"
              >
                <span className="relative z-10 font-semibold">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              {/* Mobile menu button only */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-white hover:text-pink-300 transition-all duration-300 hover:bg-white/10 relative"
                style={{ zIndex: 2147483647 }}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <div
                    className={`absolute transition-all duration-500 ease-in-out ${
                      isMobileMenuOpen
                        ? "opacity-0 rotate-180 scale-50"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                  >
                    <Menu className="w-6 h-6" />
                  </div>
                  <div
                    className={`absolute transition-all duration-500 ease-in-out ${
                      isMobileMenuOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-180 scale-50"
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel - Rendered at root level for proper z-index */}
      <div
        className={`fixed inset-0 md:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ zIndex: 2147483646 }}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-500 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-72 max-w-[85vw] h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl border-l border-white/10 transition-all duration-500 ease-in-out ${
            isMobileMenuOpen
              ? "transform translate-x-0"
              : "transform translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 right-10 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-center p-4 border-b border-white/20 backdrop-blur-sm bg-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Heart className="w-4 h-4 text-white fill-current" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">LoveConnect</h2>
                  <p className="text-xs text-gray-400">Find Your Soulmate</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-4 relative z-10">
              <div className="space-y-1">
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-lg">✨</span>
                  <span className="text-sm font-medium">Features</span>
                </a>
                <a
                  href="#testimonials"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-lg">💕</span>
                  <span className="text-sm font-medium">Success Stories</span>
                </a>
                <a
                  href="#download"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-lg">📱</span>
                  <span className="text-sm font-medium">Download</span>
                </a>
                <a
                  href="#about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-lg">👥</span>
                  <span className="text-sm font-medium">About Us</span>
                </a>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              {/* Additional Links */}
              <div className="space-y-1">
                <a
                  href="#help"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-lg">🤝</span>
                  <span className="text-sm font-medium">Help & Support</span>
                </a>
                <a
                  href="#privacy"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-lg">🔒</span>
                  <span className="text-sm font-medium">Privacy Policy</span>
                </a>
              </div>
            </nav>

            {/* CTA Buttons */}
            <div className="p-4 border-t border-white/20 backdrop-blur-sm bg-white/5 relative z-10">
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 px-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 px-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25 text-sm"
                >
                  Get Started Free ✨
                </Link>
              </div>

              {/* App Store Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center space-x-1 py-2 px-3 bg-white/10 rounded-md text-white text-xs font-medium hover:bg-white/20 transition-all duration-300">
                  <span className="text-sm">📱</span>
                  <span>App Store</span>
                </button>
                <button className="flex items-center justify-center space-x-1 py-2 px-3 bg-white/10 rounded-md text-white text-xs font-medium hover:bg-white/20 transition-all duration-300">
                  <span className="text-sm">🤖</span>
                  <span>Play Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Revolutionary Design */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20 pb-10 overflow-hidden">
        {/* Elegant background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle animated hearts */}
          <div className="absolute top-20 left-10 text-pink-400 opacity-20 animate-pulse">
            <Heart className="w-6 h-6" />
          </div>
          <div
            className="absolute top-40 right-20 text-purple-400 opacity-20 animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div
            className="absolute bottom-32 left-16 text-indigo-400 opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          >
            <Heart className="w-4 h-4" />
          </div>
          <div
            className="absolute bottom-20 right-10 text-pink-400 opacity-20 animate-bounce"
            style={{ animationDelay: "3s" }}
          >
            <Sparkles className="w-6 h-6" />
          </div>

          {/* Floating geometric shapes */}
          <div className="absolute top-24 right-32 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-40 animate-float"></div>
          <div className="absolute top-60 left-24 w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-40 right-16 w-4 h-4 bg-gradient-to-r from-indigo-400 to-pink-500 rounded-full opacity-35 animate-pulse"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6 z-10 scroll-animate-left">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/10 delay-100">
              <Flame className="w-5 h-5 text-orange-400 mr-3 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">
                🔥 2.5M+ people found love here
              </span>
            </div>

            <div className="space-y-3 delay-200">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="block text-white">Find Your</span>
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Perfect Match ✨
                </span>
              </h1>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-lg md:text-xl font-medium text-gray-300">
                <span>Swipe Right on</span>
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-bold">
                  Love
                </div>
              </div>
            </div>

            <p className="text-base md:text-lg text-gray-300 max-w-lg leading-relaxed">
              Join the revolution in dating. Our AI matches you with people who
              actually get you.
              <span className="text-pink-400 font-semibold">
                {" "}
                Real connections, real fast.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/signup"
                className="group relative overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-pink-500/30"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start Dating Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <button className="group bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-base font-semibold border border-white/20 hover:bg-white/20 transition-all hover:scale-105 flex items-center justify-center">
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Watch Stories
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 pt-6">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-white">
                  2.5M+
                </div>
                <div className="text-xs text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-white">
                  97%
                </div>
                <div className="text-xs text-gray-400">Match Rate</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-white">
                  24h
                </div>
                <div className="text-xs text-gray-400">Avg Response</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dynamic Image Gallery */}
          <div className="relative lg:block scroll-animate-right">
            <div className="relative w-full h-[400px] md:h-[450px] perspective-1000">
              {/* Main rotating image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ${
                      index === currentImageIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-110"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Couple ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
                  </div>
                ))}
              </div>

              {/* Floating interaction elements */}
              <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl p-3 shadow-lg animate-bounce transform rotate-6 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="text-sm font-bold">+1.2k likes</span>
                </div>
              </div>

              <div className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-3 shadow-lg animate-pulse transform -rotate-6 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">5.6k messages</span>
                </div>
              </div>

              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl p-3 shadow-lg animate-float rotate-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-bold">Match!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Refined & Balanced */}
      <section
        id="features"
        className="relative py-12 md:py-16 overflow-hidden"
      >
        {/* Simple Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-32 left-20 w-72 h-72 bg-pink-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-32 right-20 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Clean Header */}
          <div className="text-center mb-12 scroll-animate-up">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 mb-4">
              <Sparkles className="w-4 h-4 text-pink-400 mr-2" />
              <span className="text-sm font-medium text-gray-300">
                Why Choose Us
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              <span className="block">Features That</span>
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Actually Work
              </span>
            </h2>

            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Experience the most advanced dating platform with features
              designed for
              <span className="text-pink-400 font-semibold">
                {" "}
                real connections
              </span>{" "}
              and
              <span className="text-purple-400 font-semibold">
                {" "}
                lasting relationships
              </span>
              .
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              // Curated feature images
              const featureImages = [
                "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=240&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1522037576655-7a93ce0f4d10?w=400&h=240&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=240&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=240&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1518621012118-1a29fb56fa03?w=400&h=240&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=240&fit=crop&auto=format",
              ];

              return (
                <div
                  key={index}
                  className={`group relative scroll-animate-scale delay-${
                    index * 100
                  }`}
                >
                  {/* Card Container */}
                  <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={featureImages[index % featureImages.length]}
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Feature Icon */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {feature.icon}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>

                      <p className="text-gray-300 text-base leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>

                      {/* Feature Points */}
                      <div className="space-y-2 mb-6">
                        {index === 0 && (
                          <>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                              AI-powered smart matching
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                              Real-time compatibility
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                              HD video profiles
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></div>
                              Instant video calls
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                              ID verification
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                              Anti-scam protection
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                              180+ countries
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2"></div>
                              Multi-language
                            </div>
                          </>
                        )}
                        {index === 4 && (
                          <>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></div>
                              Live activity status
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                              Real-time matching
                            </div>
                          </>
                        )}
                        {index === 5 && (
                          <>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></div>
                              Highest success rate
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                              Premium support
                            </div>
                          </>
                        )}
                      </div>

                      {/* Learn More Link */}
                      <button className="text-pink-400 font-semibold text-sm hover:text-pink-300 transition-colors duration-300 flex items-center group/btn">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>

                    {/* Subtle Decorative Element */}
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center justify-center space-x-8 md:space-x-12 mt-16">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-white">
                97%
              </div>
              <div className="text-sm text-gray-400">Match Success</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-white">
                2.5M+
              </div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-white">
                24h
              </div>
              <div className="text-sm text-gray-400">Avg Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section id="subscription" className="relative">
        <SubscriptionPlans />
      </section>

      {/* Live Statistics Section - Enhanced */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-purple-600/20 to-indigo-600/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 scroll-animate-fade">
            <div className="inline-flex items-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium text-gray-300">
                Live Statistics
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              <span className="block">Numbers That</span>
              <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Speak for Themselves
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                number: "2.5M+",
                label: "Active Users",
                icon: <Users className="w-8 h-8" />,
                color: "from-blue-500 to-cyan-500",
                description: "People actively dating",
              },
              {
                number: "750K+",
                label: "Success Stories",
                icon: <Heart className="w-8 h-8" />,
                color: "from-pink-500 to-red-500",
                description: "Happy couples formed",
              },
              {
                number: "15M+",
                label: "Messages Daily",
                icon: <MessageCircle className="w-8 h-8" />,
                color: "from-purple-500 to-indigo-500",
                description: "Conversations started",
              },
              {
                number: "180+",
                label: "Countries",
                icon: <Globe className="w-8 h-8" />,
                color: "from-green-500 to-emerald-500",
                description: "Global reach",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`group relative scroll-animate-up delay-${
                  index * 100
                }`}
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500"></div>

                {/* Card Content */}
                <div className="relative p-4 md:p-6 text-center group-hover:-translate-y-1 transition-transform duration-500">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${stat.color} rounded-xl text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl mx-auto`}
                  >
                    {stat.icon}
                  </div>

                  {/* Number */}
                  <div
                    className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-500"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${
                        stat.color.split(" ")[1]
                      }, ${stat.color.split(" ")[3]})`,
                    }}
                  >
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-base md:text-lg font-bold text-white mb-1">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {stat.description}
                  </div>

                  {/* Decorative dot */}
                  <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced Modern Cards */}
      <section
        id="testimonials"
        className="relative py-12 md:py-16 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-black/50"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-32 left-20 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-32 right-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 scroll-animate-up">
            <div className="inline-flex items-center bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 mb-4">
              <Heart className="w-4 h-4 text-red-400 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">
                Success Stories
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              <span className="block">Real Love Stories</span>
              <span className="block bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Real Happy Endings ✨
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what happens when people
              find their person through LoveConnect.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group relative scroll-animate-scale delay-${
                  (index % 3) * 100
                }`}
              >
                {/* Card Background with Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/30 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
                <div
                  className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"
                  style={{ animationDelay: "0.2s" }}
                ></div>

                {/* Card Content */}
                <div className="relative p-6 md:p-7 group-hover:-translate-y-1 transition-transform duration-500">
                  {/* Stars Rating */}
                  <div className="flex items-center justify-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6">
                    <div className="absolute -top-1 -left-1 text-4xl text-pink-400/20 font-serif">
                      "
                    </div>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed italic group-hover:text-gray-200 transition-colors duration-300 relative z-10">
                      {testimonial.story}
                    </p>
                    <div className="absolute -bottom-2 -right-1 text-4xl text-pink-400/20 font-serif rotate-180">
                      "
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-pink-400/30 group-hover:ring-pink-400/60 transition-all duration-500"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        📍 {testimonial.location}
                      </div>
                    </div>
                  </div>

                  {/* Bottom decoration */}
                  <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <Heart className="w-8 h-8 text-pink-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Enhanced */}
      <section
        id="download"
        className="relative py-12 md:py-16 overflow-hidden"
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-purple-600/30 to-indigo-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Header */}
          <div className="mb-10 scroll-animate-up">
            <div className="inline-flex items-center bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 mb-4">
              <Flame className="w-4 h-4 text-orange-400 mr-2 animate-bounce" />
              <span className="text-sm font-medium text-gray-300">
                Ready to Start?
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              <span className="block">Your Love Story</span>
              <span className="block bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
                Starts Today 💕
              </span>
            </h2>

            <p className="text-base md:text-lg text-gray-300 mb-3 max-w-2xl mx-auto leading-relaxed">
              Join millions who found their soulmate on the world's most trusted
              dating platform.
            </p>

            <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
              Your perfect match is waiting for you right now. Don't let love
              wait any longer.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 scroll-animate-scale delay-200">
            <Link
              to="/signup"
              className="group relative overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl font-bold hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all transform hover:scale-110 shadow-2xl hover:shadow-pink-500/50 flex items-center min-w-[280px] justify-center"
            >
              <Download className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              <span className="relative z-10">Join Free Now</span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </Link>

            <button className="group bg-white/10 backdrop-blur-md text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl font-bold border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all hover:scale-105 flex items-center min-w-[280px] justify-center">
              <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Watch Success Stories
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-3 bg-white/5 backdrop-blur-lg rounded-xl px-4 py-3 border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-base font-medium text-gray-300 group-hover:text-white transition-colors">
                Free Forever
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/5 backdrop-blur-lg rounded-xl px-4 py-3 border border-white/10 hover:border-white/20 transition-all group">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-base font-medium text-gray-300 group-hover:text-white transition-colors">
                100% Secure
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/5 backdrop-blur-lg rounded-xl px-4 py-3 border border-white/10 hover:border-white/20 transition-all group">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-base font-medium text-gray-300 group-hover:text-white transition-colors">
                Instant Setup
              </span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center">
            <p className="text-sm md:text-base text-gray-400 mb-4">
              Trusted by millions worldwide
            </p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                />
              ))}
              <span className="text-gray-300 ml-2 font-semibold">
                4.9/5 from 2.5M+ reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-b from-gray-900 to-black scroll-animate">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate-up">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/10 mb-6">
              <Zap className="w-5 h-5 text-blue-400 mr-3" />
              <span className="text-sm font-medium text-gray-300">
                Simple Process
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              How Love Happens
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                In 3 Simple Steps
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              From creating your profile to finding your perfect match - we've
              made dating simple, safe, and successful.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 scroll-animate-scale">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description:
                  "Upload your best photos, write about yourself, and let our AI understand your personality.",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format",
                icon: <Camera className="w-8 h-8" />,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "Get Smart Matches",
                description:
                  "Our advanced algorithm finds people who truly align with your interests, values, and lifestyle.",
                image:
                  "https://images.unsplash.com/photo-1522037576655-7a93ce0f4d10?w=400&h=300&fit=crop&auto=format",
                icon: <Zap className="w-8 h-8" />,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Start Meaningful Chats",
                description:
                  "Connect through video calls, voice messages, and our unique conversation starters.",
                image:
                  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop&auto=format",
                icon: <MessageCircle className="w-8 h-8" />,
                color: "from-green-500 to-emerald-500",
              },
            ].map((step, index) => (
              <div
                key={index}
                className={`group relative scroll-animate-scale delay-${
                  index * 100
                }`}
              >
                <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 hover:transform hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 z-10">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center font-bold text-white shadow-lg`}
                    >
                      {step.step}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Preview */}
      <section className="relative py-12 md:py-16 overflow-hidden scroll-animate">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-10 w-48 h-48 bg-indigo-500 rounded-full filter blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-16 right-10 w-48 h-48 bg-pink-500 rounded-full filter blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left scroll-animate-left">
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/10 mb-5">
                <Download className="w-4 h-4 text-indigo-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">
                  Available Now
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 leading-tight">
                <span className="block">Take Love</span>
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Wherever You Go
                </span>
              </h2>

              <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed">
                Download our award-winning mobile app and never miss a potential
                match. Swipe, chat, and connect on the go with the most
                intuitive dating experience ever created.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg">
                  <div className="flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download for iOS
                  </div>
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-lg">
                  <div className="flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download for Android
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">4.9★</div>
                  <div className="text-xs text-gray-400">App Store</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">4.8★</div>
                  <div className="text-xs text-gray-400">Google Play</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">10M+</div>
                  <div className="text-xs text-gray-400">Downloads</div>
                </div>
              </div>
            </div>

            {/* Right Content - Phone Mockups */}
            <div className="relative lg:block scroll-animate-right">
              <div className="relative flex items-center justify-center">
                {/* Phone 1 */}
                <div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-700">
                  <div className="w-48 h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-1.5 shadow-xl">
                    <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=250&h=400&fit=crop&auto=format"
                        alt="App Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                          <div className="text-white font-bold mb-0.5 text-sm">
                            Sarah, 24
                          </div>
                          <div className="text-gray-300 text-xs">
                            2 miles away
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone 2 */}
                <div className="relative transform -rotate-12 hover:-rotate-6 transition-transform duration-700 -ml-12 z-10">
                  <div className="w-48 h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-1.5 shadow-xl">
                    <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=500&fit=crop&auto=format"
                        alt="App Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="text-white font-bold mb-1">
                            Michael, 27
                          </div>
                          <div className="text-gray-300 text-sm">
                            1 mile away
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Security Section */}
      <section className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-b from-black to-gray-900 scroll-animate">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-green-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate-up">
            <div className="inline-flex items-center bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/10 mb-6">
              <Shield className="w-5 h-5 text-green-400 mr-3" />
              <span className="text-sm font-medium text-gray-300">
                Your Safety First
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              <span className="block">Date With</span>
              <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Complete Confidence
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We've built the most secure dating platform with cutting-edge
              technology and human moderation to ensure your safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-animate-scale">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "ID Verification",
                description:
                  "Every profile is verified with government ID and live selfie verification.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: <Camera className="w-8 h-8" />,
                title: "Photo Verification",
                description:
                  "AI-powered photo verification ensures all photos are recent and authentic.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Safe Messaging",
                description:
                  "All messages are encrypted and monitored by AI for inappropriate content.",
                color: "from-purple-500 to-indigo-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group scroll-animate-scale delay-${index * 100}`}
              >
                <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 hover:border-white/20 hover:bg-white/10 transition-all duration-500 hover:transform hover:-translate-y-2">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl text-white mb-6 group-hover:scale-110 transition-transform shadow-xl`}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${
                        feature.color.split(" ")[1]
                      }, ${feature.color.split(" ")[3]})`,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/40 backdrop-blur-lg border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-current" />
                </div>
                <span className="text-2xl font-bold text-white">
                  LoveConnect
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The world's most trusted dating platform. Connecting hearts,
                creating futures.
              </p>
              <div className="flex space-x-4">
                {["💕", "✨", "🔥", "💖"].map((emoji, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Premium", "Safety", "Success Stories"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Press", "Contact"],
              },
              {
                title: "Support",
                links: ["Help Center", "Privacy", "Terms", "Community"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-white mb-6 text-lg">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 LoveConnect. Made with 💖 for finding love. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
