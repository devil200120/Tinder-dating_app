import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animation sequence on component mount
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 100);
    const timer2 = setTimeout(() => setAnimationPhase(2), 600);
    const timer3 = setTimeout(() => setAnimationPhase(3), 1100);
    const timer4 = setTimeout(() => setShowContent(true), 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/discover");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }

    setIsLoading(false);
  };

  // Floating heart particles component
  const FloatingHearts = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`absolute animate-pulse ${
            animationPhase >= 1 ? "opacity-30" : "opacity-0"
          } transition-opacity duration-1000`}
          style={{
            left: `${10 + ((i * 7) % 80)}%`,
            top: `${15 + ((i * 11) % 70)}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        >
          <Heart
            className={`w-${3 + (i % 3)} h-${
              3 + (i % 3)
            } text-pink-300/20 fill-current transform rotate-${i * 15}`}
            style={{
              filter: "blur(0.5px)",
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Animated Background Overlay */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 z-0 transition-opacity duration-1000 ${
          animationPhase >= 1 ? "opacity-50" : "opacity-0"
        }`}
      ></div>

      {/* Floating Hearts */}
      <FloatingHearts />

      {/* Main Loading Animation */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-40 bg-white transition-all duration-700 ${
          showContent ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="text-center">
          {/* Animated Logo */}
          <div
            className={`transform transition-all duration-700 ${
              animationPhase >= 1
                ? "scale-100 opacity-100"
                : "scale-75 opacity-0"
            }`}
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto animate-pulse">
                <Heart
                  className="w-12 h-12 text-white fill-current animate-bounce"
                  style={{ animationDuration: "1.5s" }}
                />
              </div>
              <div
                className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 ${
                  animationPhase >= 2 ? "scale-100" : "scale-0"
                }`}
              ></div>
            </div>
          </div>

          {/* Animated Text */}
          <div
            className={`transform transition-all duration-700 delay-300 ${
              animationPhase >= 2
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              LoveConnect
            </h1>
            <p className="text-gray-600">Find Your Soulmate</p>
          </div>

          {/* Loading Animation */}
          <div
            className={`mt-8 transform transition-all duration-700 delay-500 ${
              animationPhase >= 3
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 animate-pulse">
              Creating magic for you...
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Staggered Animation */}
      <div
        className={`min-h-screen flex bg-white overflow-hidden relative z-10 transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Left Side - Compact Login Form */}
        <div
          className={`w-full lg:w-2/5 flex items-center justify-center p-4 lg:p-6 relative bg-gradient-to-br from-white via-pink-50/10 to-purple-50/10 transform transition-all duration-1000 delay-200 ${
            showContent
              ? "translate-x-0 opacity-100"
              : "-translate-x-8 opacity-0"
          }`}
        >
          {/* Subtle Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/20 via-purple-50/20 to-indigo-50/20"></div>
          <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-gradient-to-r from-pink-200/20 to-purple-200/20 blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-gradient-to-r from-purple-200/20 to-indigo-200/20 blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="w-full max-w-sm relative z-10">
            {/* Compact Logo */}
            <div
              className={`text-center mb-6 transform transition-all duration-700 delay-400 ${
                showContent
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-4 opacity-0 scale-95"
              }`}
            >
              <Link to="/" className="inline-flex items-center space-x-2 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                </div>
                <div className="text-left">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
                    LoveConnect
                  </h1>
                  <p className="text-xs text-gray-500">Find Your Soulmate</p>
                </div>
              </Link>
            </div>

            {/* Compact Welcome Text */}
            <div
              className={`text-center mb-6 transform transition-all duration-700 delay-500 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                Welcome Back! 👋
              </h2>
              <p className="text-gray-600 text-sm">
                Sign in to continue your love journey
              </p>
            </div>

            {/* Compact Premium Login Form */}
            <div
              className={`bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl relative overflow-hidden transform transition-all duration-700 delay-600 ${
                showContent
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-6 opacity-0 scale-95"
              }`}
            >
              {/* Subtle glass effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/5 rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-t-2xl"></div>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {/* Compact Email Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-300" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm focus:bg-white hover:border-purple-300 text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Compact Password Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm focus:bg-white hover:border-purple-300 text-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Compact Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{error}</span>
                  </div>
                )}

                {/* Compact Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600 peer-checked:border-transparent transition-all duration-200"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-700 font-medium">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-indigo-700 font-semibold transition-all duration-200"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Compact Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-sm">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm">Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Compact Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/80 text-gray-600 font-medium rounded-lg">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Compact Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285f4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34a853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#fbbc04"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#ea4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" fill="#1877f2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">
                    Facebook
                  </span>
                </button>
              </div>

              {/* Compact Sign Up Link */}
              <p className="mt-4 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-indigo-700 font-semibold transition-all duration-200"
                >
                  Sign up for free
                </Link>
              </p>
            </div>

            {/* Compact Demo Credentials */}
            <div
              className={`mt-4 text-center transform transition-all duration-700 delay-700 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-xl text-xs">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  Demo: any email with password ≥ 8 chars
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Compact Photo Gallery */}
        <div
          className={`hidden lg:flex w-3/5 relative overflow-hidden transform transition-all duration-1000 delay-400 ${
            showContent
              ? "translate-x-0 opacity-100"
              : "translate-x-8 opacity-0"
          }`}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600"></div>

          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-3">
            <div className="grid grid-cols-10 grid-rows-10 h-full">
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="border border-white/10"
                  style={{
                    animationDelay: `${i * 0.02}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Compact Gallery Content */}
          <div className="relative z-10 flex flex-col justify-center items-center p-4 text-white w-full">
            {/* Compact Header Text */}
            <div
              className={`text-center mb-6 transform transition-all duration-700 delay-600 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <h2 className="text-xl lg:text-2xl font-bold mb-2 leading-tight">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
                  Love Story ✨
                </span>
              </h2>
              <p className="text-white/80 text-sm">
                Join millions who found their soulmate
              </p>
            </div>

            {/* Compact Photo Gallery Grid */}
            <div
              className={`w-full max-w-md mx-auto mb-4 transform transition-all duration-700 delay-700 ${
                showContent
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-6 opacity-0 scale-95"
              }`}
            >
              <div className="grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <div className="relative group">
                  <div className="relative h-16 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b913?w=150&h=150&fit=crop&auto=format"
                      alt="Dating profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative h-16 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format"
                      alt="Dating profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-1 right-1 bg-pink-500/70 rounded-full p-0.5">
                      <Heart className="w-1 h-1 text-white fill-current" />
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative h-16 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format"
                      alt="Dating profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative h-16 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format"
                      alt="Dating profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>

                {/* Row 2 - Feature Row */}
                <div className="col-span-2 relative group">
                  <div className="relative h-20 rounded-xl overflow-hidden shadow-lg transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=200&fit=crop&auto=format"
                      alt="Happy couple"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute top-1.5 right-1.5 bg-pink-500/80 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-2 h-2 text-white fill-current" />
                        <span className="text-white text-xs font-semibold">
                          Match!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative h-20 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format"
                      alt="Dating profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative h-20 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&auto=format"
                      alt="Dating profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-1 left-1 bg-purple-500/70 rounded-full p-0.5">
                      <Heart className="w-1 h-1 text-white fill-current" />
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="relative group">
                  <div className="relative h-16 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1522037576655-7a93ce0f4d10?w=150&h=150&fit=crop&auto=format"
                      alt="Dating couple"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative h-16 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=150&h=150&fit=crop&auto=format"
                      alt="Dating profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative h-16 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&auto=format"
                      alt="Dating profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative h-16 rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&auto=format"
                      alt="Dating profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-1 right-1 bg-pink-500/70 rounded-full p-0.5">
                      <Heart className="w-1 h-1 text-white fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Gallery Stats */}
            <div
              className={`text-center mb-4 transform transition-all duration-700 delay-800 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <p className="text-white/60 text-xs">
                Join 50,000+ active members in your area
              </p>
            </div>

            {/* Compact Floating Notifications */}
            <div
              className={`absolute top-12 right-4 bg-white/15 backdrop-blur-md rounded-lg p-2 shadow-md transform transition-all duration-700 delay-900 ${
                showContent
                  ? "translate-x-0 opacity-100 scale-100"
                  : "translate-x-4 opacity-0 scale-95"
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">5+</span>
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">
                    New Likes!
                  </div>
                  <div className="text-white/70 text-xs">Check them out</div>
                </div>
              </div>
            </div>

            <div
              className={`absolute bottom-16 left-4 bg-white/15 backdrop-blur-md rounded-lg p-2 shadow-md transform transition-all duration-700 delay-1000 ${
                showContent
                  ? "translate-x-0 opacity-100 scale-100"
                  : "-translate-x-4 opacity-0 scale-95"
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
                <div>
                  <div className="text-white text-xs font-semibold">
                    Sarah is typing...
                  </div>
                  <div className="text-white/70 text-xs">Just now</div>
                </div>
              </div>
            </div>

            {/* Compact Bottom Stats */}
            <div
              className={`grid grid-cols-3 gap-4 text-center transform transition-all duration-700 delay-1100 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <div>
                <div className="text-lg font-bold text-white">2.5M+</div>
                <div className="text-xs text-white/70">Happy Couples</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">97%</div>
                <div className="text-xs text-white/70">Success Rate</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">24h</div>
                <div className="text-xs text-white/70">Avg Match Time</div>
              </div>
            </div>
          </div>

          {/* Minimal Decorative Elements */}
          <div
            className={`absolute top-8 left-6 w-1.5 h-1.5 bg-pink-300/40 rounded-full animate-bounce transform transition-all duration-700 delay-1200 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          ></div>
          <div
            className={`absolute top-20 right-12 w-1 h-1 bg-purple-300/40 rounded-full animate-pulse transform transition-all duration-700 delay-1300 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          ></div>
          <div
            className={`absolute bottom-20 left-8 w-2 h-2 bg-indigo-300/40 rounded-full animate-bounce transform transition-all duration-700 delay-1400 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Login;
