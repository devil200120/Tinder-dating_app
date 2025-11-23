import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Mock user data for demo purposes
  useEffect(() => {
    // Simulate checking for existing authentication
    const checkAuth = async () => {
      try {
        // In a real app, you'd check localStorage, cookies, or make an API call
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Mock login - replace with actual API call
      const mockUser = {
        id: "1",
        name: "Demo User",
        email: email,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        subscription: "free", // free, premium, gold
        joinDate: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      // Mock signup - replace with actual API call
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        avatar: `https://images.unsplash.com/photo-${Math.floor(
          Math.random() * 1000000000
        )}?w=100&h=100&fit=crop`,
        subscription: "free",
        joinDate: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateSubscription = (planType) => {
    if (user) {
      const updatedUser = { ...user, subscription: planType };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const updateProfile = (profileData) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, onboardingComplete: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateSubscription,
    updateProfile,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; // Keep default export
