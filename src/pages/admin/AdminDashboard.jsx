import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 12547,
    activeUsers: 8932,
    totalMatches: 45621,
    newUsersToday: 89,
    premiumUsers: 2341,
    revenueToday: 1250.75,
  });

  const [isLive, setIsLive] = useState(false);

  // Live updates only when enabled
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeUsers: Math.max(
          8900,
          prev.activeUsers + Math.floor(Math.random() * 4) - 2
        ),
        revenueToday: prev.revenueToday + Math.random() * 0.5,
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Static activity data
  const recentActivity = useMemo(
    () => [
      {
        id: 1,
        user: "Sarah Chen",
        action: "New user registration",
        time: "2 minutes ago",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616c7d6b9d1?w=150",
      },
      {
        id: 2,
        user: "Mike Johnson",
        action: "Premium subscription",
        time: "5 minutes ago",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      },
      {
        id: 3,
        user: "Emma Wilson",
        action: "Report submitted",
        time: "8 minutes ago",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      },
      {
        id: 4,
        user: "David Lee",
        action: "Profile verification",
        time: "12 minutes ago",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      },
      {
        id: 5,
        user: "Lisa Garcia",
        action: "New match created",
        time: "15 minutes ago",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      },
    ],
    []
  );

  // Memoized toggle handler
  const handleLiveToggle = useCallback(() => {
    setIsLive((prev) => !prev);
  }, []);

  const StatCard = ({ title, value, change, icon, gradient, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative bg-gradient-to-br ${gradient} p-6 rounded-3xl shadow-2xl border border-white/30 overflow-hidden group cursor-pointer backdrop-blur-sm`}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16 blur-sm"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12 blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/30 rounded-full blur-lg"></div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white/90 text-sm font-bold tracking-wider uppercase">
            {title}
          </div>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="text-3xl drop-shadow-2xl filter"
          >
            {icon}
          </motion.div>
        </div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5, type: "spring", bounce: 0.3 }}
          className="text-white text-3xl font-black mb-3 drop-shadow-2xl"
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </motion.div>

        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="text-white/95 text-sm"
          >
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full backdrop-blur-sm border ${
                change >= 0
                  ? "bg-emerald-400/30 text-emerald-100 border-emerald-300/30"
                  : "bg-rose-400/30 text-rose-100 border-rose-300/30"
              }`}
            >
              <motion.span
                animate={{ rotate: change >= 0 ? [0, 10, 0] : [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {change >= 0 ? "📈" : "📉"}
              </motion.span>
              <span className="ml-1 font-semibold">{Math.abs(change)}%</span>
            </span>
          </motion.div>
          <div className="text-white/80 text-sm font-medium">vs yesterday</div>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center mb-8"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-50 to-rose-100 rounded-3xl blur-3xl opacity-50"></div>
        
        <div className="relative bg-white/40 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-3 tracking-tight"
              >
                <motion.span
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mr-3"
                >
                  �
                </motion.span>
                Admin Dashboard
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 text-lg font-medium"
              >
                Welcome to your dating app control center
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full mt-3"
              ></motion.div>
            </div>

            {/* Enhanced Live Toggle */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLiveToggle}
              className={`relative px-6 py-3 rounded-2xl font-bold flex items-center space-x-3 transition-all duration-300 border-2 ${
                isLive
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-2xl shadow-green-500/30 border-green-400/50"
                  : "bg-white/60 text-slate-600 hover:bg-white/80 border-slate-200/50 backdrop-blur-sm"
              }`}
            >
              <motion.div
                animate={isLive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-3 h-3 rounded-full ${
                  isLive ? "bg-white shadow-lg" : "bg-slate-400"
                }`}
              />
              <span className="text-sm">
                {isLive ? "Live Mode ON" : "Live Mode OFF"}
              </span>
              {isLive && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-300 rounded-2xl opacity-30"
                />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={12.5}
          icon="👥"
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          change={8.3}
          icon="��"
          gradient="from-green-500 to-emerald-500"
          delay={0.1}
        />
        <StatCard
          title="Total Matches"
          value={stats.totalMatches}
          change={15.7}
          icon="💕"
          gradient="from-pink-500 to-rose-500"
          delay={0.2}
        />
        <StatCard
          title="New Today"
          value={stats.newUsersToday}
          change={-3.2}
          icon="🆕"
          gradient="from-purple-500 to-indigo-500"
          delay={0.3}
        />
        <StatCard
          title="Premium Users"
          value={stats.premiumUsers}
          change={22.1}
          icon="💎"
          gradient="from-yellow-500 to-amber-500"
          delay={0.4}
        />
        <StatCard
          title="Revenue Today"
          value={`$${stats.revenueToday.toFixed(2)}`}
          change={18.9}
          icon="💰"
          gradient="from-orange-500 to-red-500"
          delay={0.5}
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-7 border border-white/40 overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-2xl opacity-30 -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10">
            <motion.h3 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl font-black text-slate-800 mb-6 flex items-center"
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-3"
              >
                📊
              </motion.span>
              Weekly Overview
            </motion.h3>

            <div className="space-y-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, index) => (
                  <motion.div 
                    key={day} 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/60 transition-all duration-300"
                  >
                    <div className="w-12 text-sm font-bold text-slate-600 flex items-center justify-center h-8 bg-slate-100/80 rounded-lg">
                      {day}
                    </div>
                    <div className="flex-1 flex space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-blue-700 font-semibold">New Users</span>
                          <span className="font-bold text-slate-700">{45 + index * 7}</span>
                        </div>
                        <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${45 + index * 7}%` }}
                            transition={{
                              delay: 1.2 + index * 0.1,
                              duration: 1,
                              type: "spring",
                              bounce: 0.3
                            }}
                            className="bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 h-2 rounded-full shadow-lg"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-pink-700 font-semibold">Matches</span>
                          <span className="font-bold text-slate-700">{156 + index * 20}</span>
                        </div>
                        <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(156 + index * 20) / 3}%` }}
                            transition={{ delay: 1.4 + index * 0.1, duration: 1, type: "spring", bounce: 0.3 }}
                            className="bg-gradient-to-r from-pink-500 via-rose-400 to-red-400 h-2 rounded-full shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-7 border border-white/40 overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full blur-2xl opacity-30 translate-y-16 -translate-x-16"></div>
          
          <div className="relative z-10">
            <motion.h3 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-xl font-black text-slate-800 mb-6 flex items-center"
            >
              <motion.span
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-3"
              >
                🔔
              </motion.span>
              Recent Activity
            </motion.h3>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.0 + index * 0.1, type: "spring", bounce: 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="flex items-center space-x-4 p-4 hover:bg-white/70 rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/50">
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full ring-2 ring-white"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800 text-sm">
                      {activity.user}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">{activity.action}</div>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold bg-slate-100/80 px-3 py-1 rounded-full">
                    {activity.time}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 text-sm shadow-lg shadow-purple-500/30"
            >
              View All Activity →
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-20 -translate-x-20"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-16 translate-x-16"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <motion.h3 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-2xl font-black mb-6 flex items-center"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              ⚡
            </motion.span>
            Quick Actions
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "User Management",
                icon: "👤",
                action: "Manage users",
                link: "/admin/users",
                color: "from-blue-400 to-cyan-400"
              },
              {
                title: "View Analytics",
                icon: "📊",
                action: "Deep analytics",
                link: "/admin/analytics",
                color: "from-green-400 to-emerald-400"
              },
              {
                title: "Review Reports",
                icon: "🔍",
                action: "Check reports",
                link: "/admin/reports",
                color: "from-orange-400 to-yellow-400"
              },
              {
                title: "Subscriptions",
                icon: "💎",
                action: "Manage premium",
                link: "/admin/subscriptions",
                color: "from-purple-400 to-pink-400"
              },
            ].map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.3 + index * 0.1, type: "spring", bounce: 0.5 }}
                whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = action.link)}
                className="group relative bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-center hover:bg-white/30 transition-all duration-300 border border-white/30 cursor-pointer overflow-hidden"
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}></div>
                
                <div className="relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-3xl mb-3"
                  >
                    {action.icon}
                  </motion.div>
                  <div className="font-bold text-sm mb-1">{action.title}</div>
                  <div className="text-xs opacity-90">{action.action}</div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="text-center py-6"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 text-slate-700 px-6 py-3 rounded-2xl border border-blue-200/50 backdrop-blur-sm shadow-lg"
        >
          <motion.span
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ℹ️
          </motion.span>
          <span className="font-semibold">
            Dashboard Overview - Visit Analytics for detailed insights
          </span>
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
