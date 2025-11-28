import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";
import { ToastProvider } from "./context/ToastContext";
import { NavbarProvider } from "./context/NavbarContext";
import { useAuth } from "./hooks/useAuth";
import { useNavbar } from "./context/NavbarContext";
import { useLastSeen } from "./hooks/useLastSeen";
import ToastContainer from "./components/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";
import LastSeenTracker from "./components/LastSeenTracker";

// Components
import Navbar from "./components/Navbar";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Chats from "./pages/Chats";
import ChatRoom from "./pages/ChatRoom";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import WhoILiked from "./pages/WhoILiked";
import WhoLikedMe from "./pages/WhoLikedMe";
import BlockedUsers from "./pages/BlockedUsers";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";
import UserManagement from "./pages/admin/UserManagement";
import ReportsManagement from "./pages/admin/ReportsManagement";
import SubscriptionManagement from "./pages/admin/SubscriptionManagement";
import MessageMonitoring from "./pages/admin/MessageMonitoring";
import AdminSettings from "./pages/admin/AdminSettings";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <LastSeenTracker>{children}</LastSeenTracker>;
};

// Public Route Component (redirect to discover if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/discover" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children }) => {
  const { isNavbarVisible } = useNavbar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 relative overflow-hidden">
      <div
        className={`transition-all duration-700 ease-out transform origin-top ${
          isNavbarVisible
            ? "translate-y-0 opacity-100 scale-y-100"
            : "translate-y-0 opacity-0 scale-y-0 pointer-events-none"
        } absolute top-0 left-0 right-0 z-30`}
      >
        <Navbar />
      </div>
      <main
        className={`transition-all duration-700 ease-out ${
          isNavbarVisible ? "pt-0" : "pt-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

// App Router Component
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <Layout>
                <Discover />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Layout>
                <Matches />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Layout>
                <Chats />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:chatId"
          element={
            <ProtectedRoute>
              <Layout>
                <ChatRoom />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/who-i-liked"
          element={
            <ProtectedRoute>
              <Layout>
                <WhoILiked />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/who-liked-me"
          element={
            <ProtectedRoute>
              <Layout>
                <WhoLikedMe />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blocked-users"
          element={
            <ProtectedRoute>
              <Layout>
                <BlockedUsers />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/app" element={<Navigate to="/discover" replace />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route
            path="users"
            element={
              <AdminProtectedRoute requiredPermission="users">
                <UserManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <AdminProtectedRoute requiredPermission="reports">
                <ReportsManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="subscriptions"
            element={
              <AdminProtectedRoute requiredPermission="subscriptions">
                <SubscriptionManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <AdminProtectedRoute requiredPermission="analytics">
                <Analytics />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="messages"
            element={
              <AdminProtectedRoute requiredPermission="content">
                <MessageMonitoring />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <AdminProtectedRoute requiredRole="super_admin">
                <AdminSettings />
              </AdminProtectedRoute>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  404
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Page not found
                </p>
                <a href="/discover" className="btn-primary">
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>
              <NavbarProvider>
                <SocketProvider>
                  <ChatProvider>
                    <AppRouter />
                    <ToastContainer />
                  </ChatProvider>
                </SocketProvider>
              </NavbarProvider>
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </AdminProvider>
    </ErrorBoundary>
  );
}

export default App;
