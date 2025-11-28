import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  ArrowRight,
  Check,
  Sparkles,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { validateEmail, validatePassword } from "../utils/helpers";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setAnimationPhase(1), 300);
    const timer2 = setTimeout(() => setAnimationPhase(2), 800);
    const timer3 = setTimeout(() => setAnimationPhase(3), 1300);
    const timer4 = setTimeout(() => setShowContent(true), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Floating Hearts Component
  const FloatingHearts = () => (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // More accurate age calculation
      const actualAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      if (actualAge < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Please agree to the terms of service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Don't show toast - let individual field errors show instead
      return;
    }

    setIsSubmitting(true);

    // Show loading toast
    const loadingToastId = toast.loading("Creating your account...", {
      title: "Setting up your profile",
    });

    try {
      // Transform form data to match backend expectations
      const signupData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        genderPreference: ["everyone"], // Default preference using correct enum value
      };

      const result = await signup(signupData);

      // Remove loading toast
      toast.removeToast(loadingToastId);

      if (result.success) {
        toast.success("Account created successfully! 🎉", {
          title: "Welcome to LoveConnect!",
          description: "Let's set up your profile to find your perfect match",
        });

        setTimeout(() => {
          navigate("/onboarding");
        }, 1000);
      } else {
        toast.error(
          result.error || "Failed to create account. Please try again.",
          {
            title: "Signup Failed",
          }
        );
        setErrors({ submit: result.error || "Failed to create account" });
      }
    } catch (error) {
      console.error("Signup error:", error);

      // Remove loading toast
      toast.removeToast(loadingToastId);

      toast.error("An unexpected error occurred during signup", {
        title: "Signup Error",
        description: "Please check your information and try again",
      });
      setErrors({ submit: error.message || "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Animated Background Overlay */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 z-0 transition-opacity duration-1000 ${
          animationPhase >= 1 ? "opacity-50" : "opacity-0"
        }`}
      />

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
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Brand Text */}
          <div
            className={`transform transition-all duration-700 delay-300 ${
              animationPhase >= 2
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent mb-2">
              LoveConnect ✨
            </h1>
            <p className="text-gray-600 mb-6">Where hearts find their home</p>
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
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
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
        {/* Left Side - Signup Form */}
        <div
          className={`w-full lg:w-3/5 flex items-center justify-center p-4 lg:p-6 relative bg-gradient-to-br from-white via-pink-50/10 to-purple-50/10 transform transition-all duration-1000 delay-200 ${
            showContent
              ? "translate-x-0 opacity-100"
              : "-translate-x-8 opacity-0"
          }`}
        >
          {/* Subtle Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/20 via-purple-50/20 to-indigo-50/20" />
          <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-gradient-to-r from-pink-200/20 to-purple-200/20 blur-2xl animate-pulse" />
          <div
            className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-gradient-to-r from-purple-200/20 to-indigo-200/20 blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          <div className="w-full max-w-lg relative z-10">
            {/* Compact Logo */}
            <div
              className={`text-center mb-6 transform transition-all duration-700 delay-400 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <Link to="/" className="inline-flex items-center space-x-2 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                </div>
                <div className="text-left">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
                    LoveConnect
                  </h1>
                  <p className="text-xs text-gray-500">Find Your Soulmate</p>
                </div>
              </Link>
            </div>

            {/* Welcome Text */}
            <div
              className={`text-center mb-6 transform transition-all duration-700 delay-500 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                Join LoveConnect ✨
              </h2>
              <p className="text-gray-600 text-sm">
                Create your account and start your love journey
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name & Last Name */}
              <div
                className={`grid grid-cols-2 gap-4 transform transition-all duration-700 delay-600 ${
                  showContent
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className={`block w-full pl-12 pr-4 py-3.5 text-gray-900 border rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-purple-500 transition-all duration-200 bg-white/80 hover:bg-white ${
                      errors.firstName
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:ring-purple-500/10"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className={`block w-full pl-12 pr-4 py-3.5 text-gray-900 border rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-purple-500 transition-all duration-200 bg-white/80 hover:bg-white ${
                      errors.lastName
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:ring-purple-500/10"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div
                className={`transform transition-all duration-700 delay-700 ${
                  showContent
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`block w-full pl-12 pr-4 py-3.5 text-gray-900 border rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-purple-500 transition-all duration-200 bg-white/80 hover:bg-white ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:ring-purple-500/10"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div
                className={`transform transition-all duration-700 delay-800 ${
                  showContent
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create password"
                    className={`block w-full pl-12 pr-12 py-3.5 text-gray-900 border rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-purple-500 transition-all duration-200 bg-white/80 hover:bg-white ${
                      errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:ring-purple-500/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div
                className={`transform transition-all duration-700 delay-900 ${
                  showContent
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`block w-full pl-12 pr-4 py-3.5 text-gray-900 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-purple-500 transition-all duration-200 bg-white/80 hover:bg-white ${
                      errors.dateOfBirth
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:ring-purple-500/10"
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender Selection */}
              <div
                className={`transform transition-all duration-700 delay-950 ${
                  showContent
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  <UserCircle className="inline w-4 h-4 mr-2" />
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["male", "female", "other"].map((genderOption) => (
                    <label key={genderOption} className="cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={genderOption}
                        checked={formData.gender === genderOption}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`px-4 py-3 text-center border rounded-xl text-sm font-medium transition-all duration-200 ${
                          formData.gender === genderOption
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 bg-white hover:border-purple-300 text-gray-700"
                        }`}
                      >
                        {genderOption.charAt(0).toUpperCase() +
                          genderOption.slice(1)}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Terms & Privacy */}
              <div
                className={`transform transition-all duration-700 delay-1000 ${
                  showContent
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div
                className={`transform transition-all duration-700 delay-1100 ${
                  showContent
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full relative px-6 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative z-10 flex items-center justify-center space-x-2">
                    <span>
                      {isSubmitting
                        ? "Creating Account..."
                        : "Create My Account"}
                    </span>
                    {!isSubmitting && (
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
                {errors.submit && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {errors.submit}
                  </p>
                )}
              </div>

              {/* Login Link */}
              <div
                className={`text-center transform transition-all duration-700 delay-1200 ${
                  showContent
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Photo Gallery */}
        <div
          className={`hidden lg:flex w-2/5 relative overflow-hidden transform transition-all duration-1000 delay-400 ${
            showContent
              ? "translate-x-0 opacity-100"
              : "translate-x-8 opacity-0"
          }`}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600" />

          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-white/10"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 lg:p-12 flex flex-col justify-center text-white">
            {/* Header */}
            <div
              className={`mb-8 transform transition-all duration-700 delay-600 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <h3 className="text-3xl font-bold mb-3 leading-tight">
                Join Thousands of
                <br />
                <span className="text-yellow-300">Happy Couples ✨</span>
              </h3>
              <p className="text-lg text-white/80 leading-relaxed">
                Discover meaningful connections and find your perfect match
              </p>
            </div>

            {/* Success Stories Grid */}
            <div
              className={`grid grid-cols-2 gap-4 mb-8 transform transition-all duration-700 delay-700 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              {[
                { name: "Sarah & Mike", duration: "2 years", img: "👫" },
                { name: "Emma & James", duration: "1 year", img: "💕" },
                { name: "Lisa & David", duration: "3 years", img: "👩‍❤️‍👨" },
                { name: "Anna & Tom", duration: "6 months", img: "💑" },
              ].map((story, index) => (
                <div
                  key={index}
                  className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 ${
                    index % 2 === 0 ? "animate-pulse" : ""
                  }`}
                  style={{
                    animationDelay: `${800 + index * 200}ms`,
                    animationDuration: "2s",
                  }}
                >
                  <div className="text-2xl mb-2">{story.img}</div>
                  <div className="text-sm font-semibold">{story.name}</div>
                  <div className="text-xs text-white/70">
                    Together {story.duration}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Activity Notification */}
            <div
              className={`bg-green-500/20 backdrop-blur-sm rounded-lg p-3 mb-6 border border-green-400/30 transform transition-all duration-700 delay-1000 ${
                showContent
                  ? "translate-x-0 opacity-100 scale-100"
                  : "-translate-x-4 opacity-0 scale-95"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                <div>
                  <div className="text-white text-xs font-semibold">
                    Someone likes you!
                  </div>
                  <div className="text-white/70 text-xs">1 minute ago</div>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div
              className={`grid grid-cols-3 gap-6 text-center transform transition-all duration-700 delay-1100 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <div>
                <div className="text-2xl font-bold text-white">500K+</div>
                <div className="text-xs text-white/70">Success Stories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-xs text-white/70">Match Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24h</div>
                <div className="text-xs text-white/70">Response Time</div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div
            className={`absolute top-12 left-8 w-2 h-2 bg-pink-300/40 rounded-full animate-bounce transform transition-all duration-700 delay-1200 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute top-32 right-16 w-1.5 h-1.5 bg-purple-300/40 rounded-full animate-pulse transform transition-all duration-700 delay-1300 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute bottom-32 left-12 w-3 h-3 bg-indigo-300/40 rounded-full animate-bounce transform transition-all duration-700 delay-1400 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </>
  );
};

export default Signup;
