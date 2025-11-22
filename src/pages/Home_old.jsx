import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, MessageCircle, Users, Star, ArrowRight, Play, Download, Zap, Shield, Camera, Globe, Award, Flame } from 'lucide-react';
import MobileMenu from '../components/MobileMenu';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // More dynamic and diverse images
  const heroImages = [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1400&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1400&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1522037576655-7a93ce0f4d10?w=1400&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1518621012118-1a29fb56fa03?w=1400&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511800453077-8c0afa94175f?w=1400&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=900&fit=crop&auto=format'
  ];

  const profileImages = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b913?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=200&h=200&fit=crop'
  ];

  const testimonials = [
    {
      name: "Emma & Jake",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b913?w=100&h=100&fit=crop",
      story: "Matched on day one, engaged after 8 months! This app is pure magic ✨",
      rating: 5,
      location: "New York, NY"
    },
    {
      name: "Sofia & Marcus",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      story: "Found my soulmate across the world. Long distance became no distance! 💕",
      rating: 5,
      location: "Los Angeles, CA"
    },
    {
      name: "Alex & Taylor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      story: "3 years together, 1000+ inside jokes, infinite love. Best decision ever! 🎉",
      rating: 5,
      location: "Miami, FL"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Matches",
      description: "AI-powered algorithm finds your perfect match in seconds, not months.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Video First Dating",
      description: "See real personalities with video profiles and instant video calls.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Verified Profiles",
      description: "Every profile is verified. No catfish, no fake accounts, just real people.",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Connections",
      description: "Connect with amazing people worldwide or right in your neighborhood.",
      color: "from-cyan-400 to-teal-500"
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "Hot Matches",
      description: "See who's interested in you right now with our real-time matching system.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Experience",
      description: "Award-winning app with the highest success rate in the industry.",
      color: "from-indigo-500 to-purple-500"
    }
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
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-800 to-indigo-900"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
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
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-purple-950">
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
              <a href="#features" className="text-gray-300 hover:text-white transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors relative group">
                Stories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#download" className="text-gray-300 hover:text-white transition-colors relative group">
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
              <MobileMenu
                isOpen={isMobileMenuOpen}
                onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Revolutionary Design */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Floating profiles animation */}
        <div className="absolute inset-0">
          {profileImages.map((img, index) => (
            <div
              key={index}
              className="absolute animate-float"
              style={{
                left: `${10 + (index * 15)}%`,
                top: `${20 + (index * 10)}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${3 + index}s`
              }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm hover:scale-110 transition-transform duration-300">
                <img src={img} alt={`Profile ${index}`} className="w-full h-full object-cover" />
              </div>
              {index % 2 === 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 z-10">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/10">
              <Flame className="w-5 h-5 text-orange-400 mr-3 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">
                🔥 2.5M+ people found love here
              </span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block text-white">Find Your</span>
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                  Perfect
                </span>
                <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  Match ✨
                </span>
              </h1>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-2xl md:text-3xl font-medium text-gray-300">
                <span>Swipe Right on</span>
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-bold animate-bounce">
                  Love
                </div>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 max-w-lg leading-relaxed">
              Join the revolution in dating. Our AI matches you with people who actually get you. 
              <span className="text-pink-400 font-semibold"> Real connections, real fast.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link
                to="/signup"
                className="group relative overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all transform hover:scale-110 shadow-2xl hover:shadow-pink-500/50"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start Dating Now
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <button className="group bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full text-xl font-bold border border-white/20 hover:bg-white/20 transition-all hover:scale-105 flex items-center justify-center">
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Watch Stories
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-black text-white">2.5M+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">97%</div>
                <div className="text-sm text-gray-400">Match Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">24h</div>
                <div className="text-sm text-gray-400">Avg Response</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dynamic Image Gallery */}
          <div className="relative lg:block">
            <div className="relative w-full h-[600px] perspective-1000">
              {/* Main rotating image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ${
                      index === currentImageIndex 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-110'
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
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl p-4 shadow-2xl animate-bounce transform rotate-12 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-2">
                  <Heart className="w-6 h-6 fill-current" />
                  <span className="font-bold">+1,234 likes today</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 shadow-2xl animate-pulse transform -rotate-12 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-6 h-6" />
                  <span className="font-bold">5,678 messages sent</span>
                </div>
              </div>

              <div className="absolute top-1/2 -left-12 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl p-4 shadow-2xl animate-float transform rotate-6">
                <div className="flex items-center space-x-2">
                  <Zap className="w-6 h-6" />
                  <span className="font-bold">Instant Match!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Card Grid */}
      <section id="features" className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why Everyone Chooses 
              <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                LoveConnect
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the most advanced dating platform with features that actually help you find lasting love.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "2.5M+", label: "Active Users", icon: <Users className="w-8 h-8" /> },
              { number: "750K+", label: "Success Stories", icon: <Heart className="w-8 h-8" /> },
              { number: "15M+", label: "Messages Daily", icon: <MessageCircle className="w-8 h-8" /> },
              { number: "180+", label: "Countries", icon: <Globe className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                  <div className="text-pink-400 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern Cards */}
      <section id="testimonials" className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Real Love Stories
              <span className="block bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Real Happy Endings ✨
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what happens when people find their person.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg mb-8 italic leading-relaxed">
                    "{testimonial.story}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-400/50 group-hover:ring-pink-400 transition-all"
                    />
                    <div>
                      <div className="font-bold text-white text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="download" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-indigo-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
            Your Love Story
            <span className="block bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              Starts Today 💕
            </span>
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join millions who found their soulmate. Your perfect match is waiting for you right now.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              to="/signup"
              className="group relative overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-12 py-6 rounded-full text-2xl font-bold hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all transform hover:scale-110 shadow-2xl hover:shadow-pink-500/50 flex items-center"
            >
              <Download className="w-7 h-7 mr-4 group-hover:animate-bounce" />
              Join Free Now
              <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </Link>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Free Forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Instant Setup</span>
            </div>
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
                <span className="text-2xl font-bold text-white">LoveConnect</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The world's most trusted dating platform. Connecting hearts, creating futures.
              </p>
              <div className="flex space-x-4">
                {['💕', '✨', '🔥', '💖'].map((emoji, index) => (
                  <div key={index} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl hover:bg-white/10 transition-colors cursor-pointer">
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
            
            {[
              { title: "Product", links: ["Features", "Premium", "Safety", "Success Stories"] },
              { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
              { title: "Support", links: ["Help Center", "Privacy", "Terms", "Community"] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-white mb-6 text-lg">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">
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
              &copy; 2025 LoveConnect. Made with 💖 for finding love. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;