// components/SubscriptionPlans.jsx
import React, { useState, useEffect } from "react";
import {
  Crown,
  Star,
  Heart,
  Check,
  Zap,
  Sparkles,
  Gift,
  Lock,
  Unlock,
  ArrowRight,
  X,
  Shield,
  Award,
} from "lucide-react";
import { subscriptionService } from "../services/subscriptionService";
import { useAuth } from "../context/AuthContext";

const SubscriptionPlans = ({ isModal = false, onClose }) => {
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [subscribing, setSubscribing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchCurrentSubscription();
    }
  }, [user]);

  // Scroll Animation Observer - runs after plans are loaded
  useEffect(() => {
    // Only run scroll animations if not in modal mode and plans are loaded
    if (isModal || !plans) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    let fallbackTimer;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Observe all elements with scroll animation classes
      const animatedElements = document.querySelectorAll(
        ".scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-up, .scroll-animate-fade, .scroll-animate-scale"
      );
      animatedElements.forEach((element) => observer.observe(element));

      // Fallback: Show all elements after 3 seconds in case scroll animation fails
      fallbackTimer = setTimeout(() => {
        animatedElements.forEach((element) => {
          if (!element.classList.contains("animate-in")) {
            element.classList.add("animate-in");
          }
        });
      }, 3000);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [plans, isModal]);

  const fetchPlans = async () => {
    try {
      const response = await subscriptionService.getPlans();
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await subscriptionService.getCurrentSubscription();
      setCurrentSubscription(response.data);
    } catch (error) {
      console.error("Error fetching current subscription:", error);
    }
  };

  const handleSubscribe = async (planType) => {
    if (!user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    try {
      setSubscribing(true);
      const response = await subscriptionService.subscribeToPlan(
        planType,
        billingCycle,
        "card"
      );

      // Handle successful subscription
      await fetchCurrentSubscription();
      setSelectedPlan(null);

      // Show success message or redirect
      if (isModal) {
        onClose?.();
      }
    } catch (error) {
      console.error("Subscription error:", error);
      // Handle error
    } finally {
      setSubscribing(false);
    }
  };

  const getPlanIcon = (planType) => {
    switch (planType) {
      case "premium":
        return <Star className="w-8 h-8" />;
      case "gold":
        return <Crown className="w-8 h-8" />;
      case "platinum":
        return <Sparkles className="w-8 h-8" />;
      default:
        return <Heart className="w-8 h-8" />;
    }
  };

  const getPlanColor = (planType) => {
    switch (planType) {
      case "premium":
        return {
          gradient: "from-purple-600 via-blue-600 to-indigo-600",
          border: "border-purple-500/50",
          glow: "purple",
          badge: "from-purple-500 to-blue-500",
        };
      case "gold":
        return {
          gradient: "from-yellow-600 via-orange-600 to-red-600",
          border: "border-yellow-500/50",
          glow: "yellow",
          badge: "from-yellow-500 to-orange-500",
        };
      case "platinum":
        return {
          gradient: "from-gray-400 via-gray-500 to-gray-600",
          border: "border-gray-400/50",
          glow: "gray",
          badge: "from-gray-400 to-gray-500",
        };
      default:
        return {
          gradient: "from-green-600 via-emerald-600 to-teal-600",
          border: "border-green-500/50",
          glow: "green",
          badge: "from-green-500 to-emerald-500",
        };
    }
  };

  const getMostPopular = () => {
    return "gold"; // Gold is most popular
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const containerClass = isModal
    ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    : "relative py-16 md:py-24 overflow-hidden";

  return (
    <div className={containerClass}>
      {isModal && (
        <>
          {/* Modal Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-black/95 backdrop-blur-xl rounded-3xl border border-white/20">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </>
      )}

      {/* Background Effects */}
      {!isModal && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/30 to-orange-900/20"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
        </>
      )}

      <div
        className={`relative ${
          isModal ? "p-8" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        }`}
      >
        {/* Header */}
        <div
          className={`text-center mb-8 ${!isModal ? "scroll-animate-up" : ""}`}
        >
          <div className="inline-flex items-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 mb-3">
            <Crown className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-xs font-medium text-gray-300">
              Choose Your Plan
            </span>
          </div>

          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
            <span className="block">Find Love</span>
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              At Your Own Pace
            </span>
          </h2>

          <p className="text-sm text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your dating journey. Upgrade or
            downgrade anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div
          className={`grid md:grid-cols-3 gap-4 max-w-4xl mx-auto ${
            !isModal ? "scroll-animate-up delay-100" : ""
          }`}
        >
          {plans &&
            Object.entries(plans).map(([planType, planData], index) => {
              const colors = getPlanColor(planType);
              const isPopular = planType === getMostPopular();
              const isCurrentPlan = currentSubscription?.plan === planType;
              const price = planType === "free" ? 0 : planData[billingCycle];

              return (
                <div
                  key={planType}
                  className={`group relative ${
                    !isModal ? `scroll-animate-scale delay-${index * 100}` : ""
                  } ${isPopular ? "transform scale-102 z-10" : ""}`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        🔥 Most Popular
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={`relative h-full bg-white/5 backdrop-blur-xl rounded-xl border ${
                      selectedPlan === planType
                        ? "border-pink-500 ring-1 ring-pink-500/50"
                        : "border-white/10 hover:border-white/20"
                    } overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl group-hover:bg-white/10`}
                  >
                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                    ></div>

                    {/* Content */}
                    <div className="relative p-4">
                      {/* Icon & Name */}
                      <div className="text-center mb-4">
                        <div
                          className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${colors.gradient} rounded-lg text-white mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg mx-auto`}
                        >
                          {getPlanIcon(planType)}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {planData.name}
                        </h3>
                        <p className="text-gray-300 text-xs">
                          {planData.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-4">
                        <div className="flex items-baseline justify-center">
                          <span className="text-2xl font-black text-white">
                            ${price}
                          </span>
                          <span className="text-gray-400 text-xs ml-1">
                            /mo
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {planType === "free"
                            ? "Forever"
                            : billingCycle === "yearly"
                            ? "per year"
                            : "per month"}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        {planData.features
                          .slice(0, 5)
                          .map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center"
                            >
                              <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                              <span className="text-gray-300 text-xs">
                                {feature}
                              </span>
                            </div>
                          ))}
                        {planData.features.length > 5 && (
                          <div className="text-xs text-gray-400 text-center">
                            +{planData.features.length - 5} more features
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() =>
                          isCurrentPlan ? null : handleSubscribe(planType)
                        }
                        disabled={subscribing || isCurrentPlan}
                        className={`w-full py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          isCurrentPlan
                            ? "bg-green-600 text-white cursor-default"
                            : planType === "free"
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                            : `bg-gradient-to-r ${colors.gradient} hover:shadow-lg hover:scale-105 active:scale-95`
                        } ${
                          subscribing ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {subscribing ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : isCurrentPlan ? (
                          <div className="flex items-center justify-center">
                            <Check className="w-3 h-3 mr-1" />
                            Current Plan
                          </div>
                        ) : planType === "free" ? (
                          "Get Started Free"
                        ) : (
                          `Upgrade to ${planData.name}`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Trust Indicators */}
        <div
          className={`text-center mt-8 ${
            !isModal ? "scroll-animate-fade delay-300" : ""
          }`}
        >
          <div className="flex items-center justify-center space-x-6 mb-4">
            <div className="flex items-center text-gray-300 group hover:text-white transition-colors duration-300">
              <Shield className="w-4 h-4 text-green-400 mr-1 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs">Secure Payments</span>
            </div>
            <div className="flex items-center text-gray-300 group hover:text-white transition-colors duration-300">
              <Award className="w-4 h-4 text-blue-400 mr-1 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs">Cancel Anytime</span>
            </div>
            <div className="flex items-center text-gray-300 group hover:text-white transition-colors duration-300">
              <Star className="w-4 h-4 text-yellow-400 mr-1 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs">30-Day Guarantee</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs max-w-xl mx-auto">
            All plans include our core safety features and customer support. No
            hidden fees, no long-term commitments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
