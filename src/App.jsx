import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";
import { useAuth } from "./hooks/useAuth";

// Components
import Navbar from "./components/Navbar";

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

  return children;
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
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <Navbar />
      <main>{children}</main>
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
          path="/chats/:userId"
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

        {/* Default Route */}
        <Route path="/app" element={<Navigate to="/discover" replace />} />

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
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider>
          <AppRouter />
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
