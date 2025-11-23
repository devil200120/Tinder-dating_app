import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
      color: "from-purple-500 to-pink-500",
      badge: null,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
      color: "from-blue-500 to-cyan-500",
      badge: "2.3k",
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: "🚨",
      color: "from-red-500 to-orange-500",
      badge: "12",
    },
    {
      name: "Subscriptions",
      path: "/admin/subscriptions",
      icon: "💎",
      color: "from-yellow-500 to-amber-500",
      badge: null,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: "📈",
      color: "from-green-500 to-emerald-500",
      badge: "New",
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: "💬",
      color: "from-indigo-500 to-purple-500",
      badge: "45",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: "⚙️",
      color: "from-gray-500 to-slate-500",
      badge: null,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 220 : 55,
          x: 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 
          bg-white shadow-2xl flex flex-col border-r border-purple-100
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          transition-transform duration-300 ease-in-out lg:transition-none
        `}
        style={{ minWidth: isSidebarOpen ? "220px" : "55px" }}
      >
        {/* Header */}
        <div
          className={`flex-shrink-0 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 ${
            isSidebarOpen ? "p-3" : "p-2"
          }`}
        >
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
                >
                  💕
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-left"
                >
                  <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    LoveAdmin Pro
                  </h1>
                  <p className="text-gray-500 text-xs font-medium">
                    Dating Control Center
                  </p>
                </motion.div>
              </div>
            ) : (
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg mx-auto"
              >
                💕
              </motion.div>
            )}

            {/* Mobile Close Button */}
            {isSidebarOpen && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 flex items-center justify-center transition-all duration-200"
              >
                ✕
              </motion.button>
            )}
          </div>
        </div>
        {/* Navigation - Scrollable Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <div
              className={`${
                isSidebarOpen ? "px-3 py-2" : "px-2 py-2"
              } space-y-3`}
            >
              {/* Main Navigation */}
              <div>
                {isSidebarOpen && (
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Main Menu
                  </h3>
                )}
                <div className="space-y-1">
                  {menuItems.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center transition-all duration-200 group relative overflow-hidden ${
                            isSidebarOpen
                              ? `gap-2 px-2.5 py-2 rounded-lg ${
                                  isActive
                                    ? "bg-gradient-to-r text-white shadow-lg transform scale-[1.02] shadow-purple-200/50"
                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:transform hover:scale-[1.01] hover:shadow-md"
                                }`
                              : `gap-0 p-2 rounded-lg justify-center ${
                                  isActive
                                    ? "bg-gradient-to-r text-white shadow-lg"
                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                }`
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className={`absolute inset-0 bg-gradient-to-r ${
                                  item.color
                                } ${
                                  isSidebarOpen ? "rounded-lg" : "rounded-lg"
                                } shadow-lg`}
                                initial={false}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                              />
                            )}
                            <span
                              className={`relative z-10 transform group-hover:scale-110 transition-transform duration-200 ${
                                isSidebarOpen ? "text-lg" : "text-base"
                              }`}
                            >
                              {item.icon}
                            </span>
                            {isSidebarOpen && (
                              <div className="flex-1 flex items-center justify-between relative z-10">
                                <span className="font-semibold text-xs">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`px-3 py-1 text-xs rounded-full font-bold ${
                                      item.badge === "New"
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-blue-100 text-blue-700 border border-blue-200"
                                    }`}
                                  >
                                    {item.badge}
                                  </motion.span>
                                )}
                              </div>
                            )}
                            {!isSidebarOpen && (
                              <div className="absolute left-16 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                {item.name}
                                {item.badge && (
                                  <span
                                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                      item.badge === "New"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-blue-500 text-white"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Analytics & Tools */}
              <div>
                {isSidebarOpen && (
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Analytics & Tools
                  </h3>
                )}
                <div className="space-y-1">
                  {menuItems.slice(4, 6).map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (index + 4) * 0.05 }}
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center transition-all duration-200 group relative overflow-hidden ${
                            isSidebarOpen
                              ? `gap-3 px-3 py-2.5 rounded-xl ${
                                  isActive
                                    ? "bg-gradient-to-r text-white shadow-lg transform scale-[1.02] shadow-purple-200/50"
                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:transform hover:scale-[1.01] hover:shadow-md"
                                }`
                              : `gap-0 p-2.5 rounded-lg justify-center ${
                                  isActive
                                    ? "bg-gradient-to-r text-white shadow-lg"
                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                }`
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className={`absolute inset-0 bg-gradient-to-r ${
                                  item.color
                                } ${
                                  isSidebarOpen ? "rounded-xl" : "rounded-lg"
                                } shadow-lg`}
                                initial={false}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                              />
                            )}
                            <span
                              className={`relative z-10 transform group-hover:scale-110 transition-transform duration-200 ${
                                isSidebarOpen ? "text-xl" : "text-lg"
                              }`}
                            >
                              {item.icon}
                            </span>
                            {isSidebarOpen && (
                              <div className="flex-1 flex items-center justify-between relative z-10">
                                <span className="font-semibold text-sm">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`px-3 py-1 text-xs rounded-full font-bold ${
                                      item.badge === "New"
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-blue-100 text-blue-700 border border-blue-200"
                                    }`}
                                  >
                                    {item.badge}
                                  </motion.span>
                                )}
                              </div>
                            )}
                            {!isSidebarOpen && (
                              <div className="absolute left-16 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                {item.name}
                                {item.badge && (
                                  <span
                                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                      item.badge === "New"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-blue-500 text-white"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* System Settings */}
              <div>
                {isSidebarOpen && (
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    System
                  </h3>
                )}
                <div className="space-y-1.5">
                  {menuItems.slice(6).map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (index + 6) * 0.05 }}
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center transition-all duration-200 group relative overflow-hidden ${
                            isSidebarOpen
                              ? `gap-3 px-3 py-2.5 rounded-xl ${
                                  isActive
                                    ? "bg-gradient-to-r text-white shadow-lg transform scale-[1.02] shadow-purple-200/50"
                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:transform hover:scale-[1.01] hover:shadow-md"
                                }`
                              : `gap-0 p-2.5 rounded-lg justify-center ${
                                  isActive
                                    ? "bg-gradient-to-r text-white shadow-lg"
                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                }`
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className={`absolute inset-0 bg-gradient-to-r ${
                                  item.color
                                } ${
                                  isSidebarOpen ? "rounded-xl" : "rounded-lg"
                                } shadow-lg`}
                                initial={false}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                              />
                            )}
                            <span
                              className={`relative z-10 transform group-hover:scale-110 transition-transform duration-200 ${
                                isSidebarOpen ? "text-xl" : "text-lg"
                              }`}
                            >
                              {item.icon}
                            </span>
                            {isSidebarOpen && (
                              <div className="flex-1 flex items-center justify-between relative z-10">
                                <span className="font-semibold text-sm">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`px-3 py-1 text-xs rounded-full font-bold ${
                                      item.badge === "New"
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-blue-100 text-blue-700 border border-blue-200"
                                    }`}
                                  >
                                    {item.badge}
                                  </motion.span>
                                )}
                              </div>
                            )}
                            {!isSidebarOpen && (
                              <div className="absolute left-16 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                {item.name}
                                {item.badge && (
                                  <span
                                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                      item.badge === "New"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-blue-500 text-white"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions - Only show when expanded */}
              {isSidebarOpen && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:shadow-emerald-200/50"
                    >
                      <div className="text-lg mb-1">📊</div>
                      <div className="text-xs">Export Data</div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:shadow-orange-200/50"
                    >
                      <div className="text-lg mb-1">🚨</div>
                      <div className="text-xs">Send Alert</div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:shadow-blue-200/50"
                    >
                      <div className="text-lg mb-1">📧</div>
                      <div className="text-xs">Broadcast</div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:shadow-purple-200/50"
                    >
                      <div className="text-lg mb-1">⚡</div>
                      <div className="text-xs">Quick Backup</div>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>{" "}
        {/* Bottom Stats & Profile Section */}
        <div
          className={`flex-shrink-0 border-t border-purple-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50 ${
            isSidebarOpen ? "p-2.5" : "p-1.5"
          }`}
        >
          {/* Live Stats - Only show when expanded */}
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 bg-gradient-to-r from-purple-100 to-pink-100 p-2.5 rounded-lg border border-purple-200/50 shadow-sm"
            >
              <div className="text-gray-800 text-xs font-bold mb-1.5 flex items-center gap-1.5">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                ></motion.span>
                Live Activity
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-emerald-600 font-bold text-base">
                    2.3k
                  </div>
                  <div className="text-gray-500 text-xs font-medium">
                    Users Online
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 font-bold text-base">45</div>
                  <div className="text-gray-500 text-xs font-medium">
                    Matches/hr
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Section */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className={`flex items-center w-full rounded-lg hover:bg-white/80 transition-all duration-200 border border-gray-200/50 hover:border-purple-200 hover:shadow-md group ${
                isSidebarOpen ? "gap-2 p-2.5" : "justify-center p-2"
              }`}
            >
              <div className="relative">
                <div
                  className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-200 ${
                    isSidebarOpen ? "w-9 h-9 text-sm" : "w-8 h-8 text-xs"
                  }`}
                >
                  A
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 bg-emerald-400 rounded-full border-2 border-white shadow-sm ${
                    isSidebarOpen ? "w-3 h-3" : "w-2.5 h-2.5"
                  }`}
                ></div>
              </div>
              {isSidebarOpen && (
                <div className="text-left flex-1">
                  <div className="text-gray-800 text-xs font-bold">
                    Admin User
                  </div>
                  <div className="text-gray-500 text-xs font-medium">
                    System Administrator
                  </div>
                </div>
              )}
              {isSidebarOpen && (
                <motion.div
                  animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 text-lg"
                >
                  ▼
                </motion.div>
              )}
              {!isSidebarOpen && (
                <div className="absolute left-16 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Admin User
                  <br />
                  <span className="text-xs text-gray-300">
                    System Administrator
                  </span>
                </div>
              )}
            </motion.button>

            {/* Profile Dropdown - Only show when sidebar is open */}
            <AnimatePresence>
              {isProfileDropdownOpen && isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 right-0 mb-3 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50"
                >
                  <div className="p-2">
                    <motion.button
                      whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                      onClick={() => {
                        navigate("/admin/profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left p-4 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-200 text-sm flex items-center gap-3 font-medium"
                    >
                      <span className="text-blue-500 text-lg">👤</span>
                      Profile Settings
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                      onClick={() => {
                        navigate("/admin/preferences");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left p-4 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-200 text-sm flex items-center gap-3 font-medium"
                    >
                      <span className="text-purple-500 text-lg">🎨</span>
                      Preferences
                    </motion.button>
                    <hr className="border-gray-200/50 my-1" />
                    <motion.button
                      whileHover={{ backgroundColor: "rgb(254 242 242)" }}
                      onClick={handleLogout}
                      className="w-full text-left p-4 text-red-600 hover:text-red-700 rounded-xl transition-all duration-200 text-sm flex items-center gap-3 font-medium"
                    >
                      <span className="text-red-500 text-lg">🚪</span>
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-0" : "lg:ml-0"
        }`}
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 sticky top-0 z-30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </motion.button>

              {/* Desktop Sidebar Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <motion.svg
                  animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </motion.svg>
              </motion.button>

              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Love Dashboard
                </h2>
                <p className="text-gray-500 text-sm">
                  Manage your dating platform
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative hidden md:block"
              >
                <input
                  type="text"
                  placeholder="Search users, reports..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </motion.div>

              {/* Notifications */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <button className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors relative">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-5 5v-5zM9 15l5-5m0 0l-5-5m5 5H3"
                    />
                  </svg>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  ></motion.span>
                </button>
              </motion.div>

              {/* Live Status */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                ></motion.div>
                <span className="text-sm font-medium text-green-700">Live</span>
              </div>

              {/* Profile Quick Access */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
              >
                A
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 overflow-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
