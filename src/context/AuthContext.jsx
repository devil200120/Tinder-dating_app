import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService.js";
import { userService } from "../services/userService.js";
import { subscriptionService } from "../services/subscriptionService.js";

const AuthContext = createContext();

export { AuthContext }; // Add named export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          try {
            // Verify token is still valid by fetching current user
            const userData = await authService.getCurrentUser();
            setUser(userData.user || JSON.parse(savedUser));
            setIsAuthenticated(true);
          } catch (error) {
            // Token invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Real API call for login
      const response = await authService.login({ email, password });
      console.log("AuthService response:", response);

      if (response && response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return {
          success: false,
          error: response?.message || response?.error || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login failed in AuthContext:", error);
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Network error occurred",
      };
    } finally {
      // Use a small delay to prevent rapid state changes
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);

      // Real API call for signup
      const response = await authService.register(userData);

      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.message || "Signup failed" };
      }
    } catch (error) {
      console.error("Signup failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || error.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateSubscription = async (planType) => {
    try {
      const response = await subscriptionService.subscribeToPlan(planType);
      if (response.success) {
        const updatedUser = { ...user, subscription: planType };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return {
        success: false,
        error: response.message || "Subscription update failed",
      };
    } catch (error) {
      console.error("Subscription update failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Subscription update failed",
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await userService.updateProfile(profileData);
      if (response.success && response.data) {
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return {
        success: false,
        error: response.message || "Profile update failed",
      };
    } catch (error) {
      console.error("Profile update failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Profile update failed",
      };
    }
  };

  const completeOnboarding = async (profileData = {}) => {
    try {
      // Combine onboarding completion with profile data
      const updateData = {
        ...profileData,
        onboardingComplete: true,
      };

      const response = await userService.updateProfile(updateData);
      console.log("Update profile response:", response);

      if (response.success && (response.user || response.data)) {
        const updatedUser = response.user || response.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return {
        success: false,
        error: response.message || "Onboarding completion failed",
      };
    } catch (error) {
      console.error("Onboarding completion failed:", error);
      return {
        success: false,
        error: error.message || "Onboarding completion failed",
      };
    }
  };

  const updateUserStatus = async (isOnline) => {
    try {
      const response = await userService.updateUserStatus(isOnline);
      if (response.success && response.data) {
        const updatedUser = {
          ...user,
          status: {
            ...user?.status,
            isOnline,
            lastSeen: new Date().toISOString(),
          },
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { success: true };
      }
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    token: localStorage.getItem("token"),
    login,
    signup,
    logout,
    updateSubscription,
    updateProfile,
    completeOnboarding,
    updateUserStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; // Keep default export
