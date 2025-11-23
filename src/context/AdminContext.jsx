import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if admin is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("adminToken");
      const adminData = localStorage.getItem("adminData");

      if (token && adminData) {
        try {
          const parsedAdmin = JSON.parse(adminData);
          setAdmin(parsedAdmin);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing admin data:", error);
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminData");
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/admin/login', { email, password });

      // Mock login for now
      if (email === "admin@datingapp.com" && password === "admin123") {
        const mockAdmin = {
          _id: "1",
          name: "Super Admin",
          email: "admin@datingapp.com",
          role: "super_admin",
          permissions: ["all"],
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        };

        const mockToken = "mock-admin-token-" + Date.now();

        localStorage.setItem("adminToken", mockToken);
        localStorage.setItem("adminData", JSON.stringify(mockAdmin));

        setAdmin(mockAdmin);
        setIsAuthenticated(true);

        return { success: true, admin: mockAdmin, token: mockToken };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const updateAdmin = (updatedData) => {
    const updatedAdmin = { ...admin, ...updatedData };
    setAdmin(updatedAdmin);
    localStorage.setItem("adminData", JSON.stringify(updatedAdmin));
  };

  // Check if admin has specific permission
  const hasPermission = (permission) => {
    if (!admin || !admin.permissions) return false;
    return (
      admin.permissions.includes("all") ||
      admin.permissions.includes(permission)
    );
  };

  // Check if admin has specific role
  const hasRole = (role) => {
    if (!admin) return false;
    return admin.role === role || admin.role === "super_admin";
  };

  const value = {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateAdmin,
    hasPermission,
    hasRole,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContext;
