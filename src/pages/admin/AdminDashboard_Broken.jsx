import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 12547,
    activeUsers: 8932,
    totalMatches: 45621,
    newUsersToday: 89,
    premiumUsers: 2341,
    revenueToday: 1250.75,
    averageAge: 26.4,
    successRate: 78.2,
    dailyActiveUsers: 6834,
    monthlyRevenue: 38425.50,
    conversionRate: 12.8,
    retentionRate: 85.6,
  });

  const [timeFilter, setTimeFilter] = useState('7d');
  const [isLive, setIsLive] = useState(false); // Set to false by default to prevent constant animations
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
  // Simulate real-time updates with less frequency
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        revenueToday: prev.revenueToday + Math.random() * 2, // Reduced increment
        newUsersToday: prev.newUsersToday + (Math.random() > 0.9 ? 1 : 0), // Less frequent
      }));
    }, 10000); // Increased interval to 10 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Mark as loaded after initial mount
  useEffect(() => {
    const timer = setTimeout(() => setHasInitiallyLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Static activity data - won't cause re-renders
  const recentActivity = useMemo(() => [
    {
      id: 1,
      user: "Sarah Chen",
      action: "New user registration",
      time: "2 minutes ago",
      type: "registration",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c7d6b9d1?w=150",
    },
    {
      id: 2,
      user: "Mike Johnson",
      action: "Premium subscription",
      time: "5 minutes ago",
      type: "premium",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
      id: 3,
      user: "Emma Wilson",
      action: "Report submitted",
      time: "8 minutes ago",
      type: "report",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    },
    {
      id: 4,
      user: "David Lee", 
      action: "Profile verification",
      time: "12 minutes ago",
      type: "verification",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    },
    {
      id: 5,
      user: "Lisa Garcia",
      action: "New match created",
      time: "15 minutes ago",
      type: "match",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    },
    {
      id: 6,
      user: "Alex Martinez",
      action: "Message sent",
      time: "18 minutes ago", 
      type: "message",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1?w=150",
    },
    {
      id: 7,
      user: "Sophie Turner",
      action: "Photo uploaded",
      time: "22 minutes ago",
      type: "photo",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    }
  ], []);] = useState({
    totalUsers: 12547,
    activeUsers: 8932,
    totalMatches: 45621,
    newUsersToday: 89,
    premiumUsers: 2341,
    revenueToday: 1250.75,
    averageAge: 26.4,
    successRate: 78.2,
    dailyActiveUsers: 6834,
    monthlyRevenue: 38425.50,
    conversionRate: 12.8,
    retentionRate: 85.6,
  });

  const [timeFilter, setTimeFilter] = useState('7d');
  const [isLive, setIsLive] = useState(false); // Set to false by default to prevent constant animations
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
  // Simulate real-time updates with less frequency
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        revenueToday: prev.revenueToday + Math.random() * 2, // Reduced increment
        newUsersToday: prev.newUsersToday + (Math.random() > 0.9 ? 1 : 0), // Less frequent
      }));
    }, 10000); // Increased interval to 10 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Mark as loaded after initial mount
  useEffect(() => {
    const timer = setTimeout(() => setHasInitiallyLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoize static data to prevent unnecessary re-renders
  const staticData = useMemo(() => ({
    genderData: [
      { label: 'Male', value: 52.3, color: 'from-blue-500 to-cyan-500' },
      { label: 'Female', value: 45.2, color: 'from-pink-500 to-rose-500' },
      { label: 'Other', value: 2.5, color: 'from-purple-500 to-indigo-500' }
    ],
    ageDistribution: [
      { range: '18-24', percentage: 28.5, users: 3567 },
      { range: '25-34', percentage: 42.1, users: 5283 },
      { range: '35-44', percentage: 21.3, users: 2674 },
      { range: '45+', percentage: 8.1, users: 1023 }
    ],
    liveMetrics: {
      users: [
        { time: '00:00', value: 8532 },
        { time: '04:00', value: 6234 },
        { time: '08:00', value: 7845 },
        { time: '12:00', value: 9567 },
        { time: '16:00', value: 8932 },
        { time: '20:00', value: 8123 },
        { time: '24:00', value: 7234 }
      ],
      matches: [
        { time: '00:00', value: 234 },
        { time: '04:00', value: 123 },
        { time: '08:00', value: 345 },
        { time: '12:00', value: 567 },
        { time: '16:00', value: 432 },
        { time: '20:00', value: 398 },
        { time: '24:00', value: 289 }
      ],
      revenue: [
        { time: '00:00', value: 1250 },
        { time: '04:00', value: 890 },
        { time: '08:00', value: 1450 },
        { time: '12:00', value: 2100 },
        { time: '16:00', value: 1875 },
        { time: '20:00', value: 1650 },
        { time: '24:00', value: 1430 }
      ]
    }
  }), []);

  const StatCard = useCallback(({ title, value, change, icon, gradient, delay, subtitle, isLive: cardLive = false, staticCard = false }) => (
    <motion.div
      key={staticCard ? `${title}-static` : `${title}-${value}`} // Use static key for non-updating cards
      initial={hasInitiallyLoaded ? false : { opacity: 0, y: 20 }}
      animate={hasInitiallyLoaded ? false : { opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative bg-gradient-to-br ${gradient} p-6 rounded-3xl shadow-2xl border border-white/20 overflow-hidden group cursor-pointer`}
    >
      {/* Animated Background - Only animate on initial load */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={hasInitiallyLoaded ? {} : { 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={hasInitiallyLoaded ? {} : { 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"
        />
        <motion.div
          animate={hasInitiallyLoaded ? {} : { 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={hasInitiallyLoaded ? {} : { 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"
        />
      </div>

      {/* Live indicator - Only show pulsing for live cards */}
      {cardLive && isLive && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full shadow-lg"
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <div className="text-white/90 text-sm font-semibold tracking-wide uppercase">{title}</div>
            {subtitle && <div className="text-white/70 text-xs">{subtitle}</div>}
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-4xl drop-shadow-lg"
          >
            {icon}
          </motion.div>
        </div>
        
        {/* Only animate value change for live cards */}
        <motion.div
          key={cardLive && isLive ? value : 'static'}
          initial={cardLive && isLive ? { scale: 0.8, opacity: 0 } : false}
          animate={cardLive && isLive ? { scale: 1, opacity: 1 } : false}
          transition={{ duration: 0.3 }}
          className="text-white text-3xl font-bold mb-3 drop-shadow-lg"
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </motion.div>
        
        <div className="flex items-center justify-between">
          <div className="text-white/90 text-sm">
            <motion.span
              animate={cardLive && isLive && change >= 0 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center px-2 py-1 rounded-full ${
                change >= 0 ? "bg-green-400/20 text-green-100" : "bg-red-400/20 text-red-100"
              }`}
            >
              {change >= 0 ? "📈" : "📉"} {Math.abs(change)}%
            </motion.span>
          </div>
          <div className="text-white/70 text-xs">vs yesterday</div>
        </div>
      </div>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backdropFilter: 'blur(10px)' }}
      />
    </motion.div>
  ), [hasInitiallyLoaded, isLive]);

  const InteractiveChart = ({ data, selectedMetric, onMetricChange }) => {
    const maxValue = Math.max(...data[selectedMetric].map(d => d.value));
    
    return (
      <div className="space-y-6">
        {/* Chart Controls */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {Object.keys(data).map(metric => (
              <motion.button
                key={metric}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMetricChange(metric)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  selectedMetric === metric
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </motion.button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span>Live Data</span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-end justify-between h-full space-x-2">
            {data[selectedMetric].map((point, index) => (
              <motion.div
                key={point.time}
                initial={{ height: 0 }}
                animate={{ height: `${(point.value / maxValue) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.8, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center group cursor-pointer"
                style={{ width: `${100/data[selectedMetric].length - 2}%` }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg relative overflow-hidden"
                >
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-1 bg-white/30"
                  />
                  
                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10"
                  >
                    {point.value.toLocaleString()}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                  </motion.div>
                </motion.div>
                
                <div className="text-xs text-gray-600 mt-2 font-medium">{point.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const CircularProgress = ({ percentage, label, color, size = 120 }) => {
    const radius = (size - 20) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={`url(#${color}Gradient)`}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="drop-shadow-lg"
            />
            <defs>
              <linearGradient id={`${color}Gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : '#EC4899'} />
                <stop offset="100%" stopColor={color === 'blue' ? '#1D4ED8' : color === 'green' ? '#059669' : '#BE185D'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
            </motion.div>
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-800">{label}</div>
        </div>
      </div>
    );
  };

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    registrations: [45, 52, 38, 67, 89, 94, 78],
    matches: [156, 189, 145, 234, 198, 267, 223],
  };

  return (
    <div className="space-y-8 relative">
      {/* Floating background elements - Only show on initial load */}
      {!hasInitiallyLoaded && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -120, 0],
              y: [0, 80, 0],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
          />
        </div>
      )}

      {/* Header with Live Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
              💝 LoveMetrics Pro
            </h1>
            <p className="text-gray-600 text-lg">Advanced Dating Platform Analytics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLive(!isLive)}
              className={`px-6 py-3 rounded-2xl font-semibold flex items-center space-x-2 transition-all ${
                isLive 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <motion.div
                animate={isLive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-3 h-3 rounded-full ${isLive ? 'bg-white' : 'bg-gray-400'}`}
              />
              <span>{isLive ? 'Live' : 'Paused'}</span>
            </motion.button>
            
            <div className="flex bg-white rounded-2xl p-1 shadow-lg border border-gray-200">
              {['1d', '7d', '30d', '90d'].map(period => (
                <motion.button
                  key={period}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeFilter(period)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    timeFilter === period
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {period}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Users"
          subtitle="Lifetime registrations"
          value={stats.totalUsers}
          change={12.5}
          icon="👥"
          gradient="from-blue-500 to-cyan-500"
          delay={0}
          isLive={isLive}
        />
        <StatCard
          title="Active Users"
          subtitle="Currently online"
          value={stats.activeUsers}
          change={8.3}
          icon="💚"
          gradient="from-green-500 to-emerald-500"
          delay={0.1}
          isLive={isLive}
        />
        <StatCard
          title="Total Matches"
          subtitle="Successful connections"
          value={stats.totalMatches}
          change={15.7}
          icon="💕"
          gradient="from-pink-500 to-rose-500"
          delay={0.2}
          isLive={isLive}
        />
        <StatCard
          title="New Today"
          subtitle="Fresh registrations"
          value={stats.newUsersToday}
          change={-3.2}
          icon="🆕"
          gradient="from-purple-500 to-indigo-500"
          delay={0.3}
          isLive={isLive}
        />
        <StatCard
          title="Premium Users"
          subtitle="Subscription active"
          value={stats.premiumUsers}
          change={22.1}
          icon="💎"
          gradient="from-yellow-500 to-amber-500"
          delay={0.4}
          isLive={isLive}
        />
        <StatCard
          title="Revenue Today"
          subtitle="Daily earnings"
          value={`$${stats.revenueToday.toFixed(2)}`}
          change={18.9}
          icon="💰"
          gradient="from-orange-500 to-red-500"
          delay={0.5}
          isLive={isLive}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Success Rate"
          subtitle="Match to conversation"
          value={`${stats.successRate}%`}
          change={4.2}
          icon="🎯"
          gradient="from-teal-500 to-green-500"
          delay={0.6}
          staticCard={true}
        />
        <StatCard
          title="Avg Age"
          subtitle="User demographics"
          value={stats.averageAge}
          change={0.8}
          icon="🎂"
          gradient="from-indigo-500 to-purple-500"
          delay={0.7}
          staticCard={true}
        />
        <StatCard
          title="Retention Rate"
          subtitle="30-day retention"
          value={`${stats.retentionRate}%`}
          change={2.4}
          icon="🔄"
          gradient="from-cyan-500 to-blue-500"
          delay={0.8}
          staticCard={true}
        />
        <StatCard
          title="Conversion"
          subtitle="Free to premium"
          value={`${stats.conversionRate}%`}
          change={7.1}
          icon="⚡"
          gradient="from-rose-500 to-pink-500"
          delay={0.9}
          staticCard={true}
        />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Interactive Chart */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📈 Live Analytics
              </h3>
              <div className="text-sm text-gray-500">Last 24 hours</div>
            </div>
            <InteractiveChart 
              data={staticData.liveMetrics} 
              selectedMetric={selectedMetric} 
              onMetricChange={setSelectedMetric} 
            />
          </motion.div>
        </div>

        {/* Circular Progress Cards */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/50"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Key Metrics</h3>
            <div className="space-y-6">
              <CircularProgress percentage={stats.successRate} label="Success Rate" color="blue" size={100} />
              <CircularProgress percentage={stats.retentionRate} label="Retention" color="green" size={100} />
              <CircularProgress percentage={stats.conversionRate} label="Conversion" color="pink" size={100} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Demographics and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gender Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            ⚧️ Gender Distribution
          </h3>
          <div className="space-y-4">
            {staticData.genderData.map((gender, index) => (
              <motion.div
                key={gender.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${gender.color}`}></div>
                  <span className="font-medium text-gray-800">{gender.label}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">{gender.value}%</div>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${gender.value}%` }}
                      transition={{ delay: 1.5 + index * 0.2, duration: 1 }}
                      className={`bg-gradient-to-r ${gender.color} h-3 rounded-full shadow-sm`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Age Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            📊 Age Demographics
          </h3>
          <div className="space-y-4">
            {staticData.ageDistribution.map((age, index) => (
              <motion.div
                key={age.range}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="relative p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{age.range} years</span>
                  <span className="text-sm text-gray-600">{age.users.toLocaleString()} users</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${age.percentage}%` }}
                      transition={{ delay: 1.6 + index * 0.2, duration: 1.2 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full shadow-sm relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: [-20, 100] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-6 h-full bg-white/30 skew-x-12"
                      />
                    </motion.div>
                  </div>
                  <span className="text-lg font-bold text-purple-600 min-w-[3rem] text-right">
                    {age.percentage}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      {/* Enhanced Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            🔔 Live Activity Stream
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-2xl transition-all group cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-white">
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        activity.type === 'registration' ? 'bg-blue-500' :
                        activity.type === 'premium' ? 'bg-yellow-500' :
                        activity.type === 'match' ? 'bg-pink-500' :
                        activity.type === 'report' ? 'bg-red-500' :
                        activity.type === 'verification' ? 'bg-green-500' :
                        activity.type === 'message' ? 'bg-purple-500' : 'bg-cyan-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {activity.user}
                    </div>
                    <div className="text-sm text-gray-600 truncate">{activity.action}</div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-xl transition-all"
          >
            View All Activity →
          </motion.button>
        </motion.div>

        {/* Revenue Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            💰 Revenue Insights
          </h3>
          <div className="space-y-6">
            {/* Monthly Revenue */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-green-700 font-semibold">Monthly Revenue</span>
                <span className="text-2xl">💵</span>
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">
                ${stats.monthlyRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">+24.5% from last month</div>
            </div>

            {/* Daily Active Users Trend */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-700 font-semibold">Daily Active Users</span>
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-blue-800 mb-2">
                {stats.dailyActiveUsers.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Peak: 9,247 at 8 PM</div>
            </div>

            {/* Quick Revenue Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 text-center">
                <div className="text-lg font-bold text-purple-800">$127.45</div>
                <div className="text-xs text-purple-600">Avg. per user</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 text-center">
                <div className="text-lg font-bold text-amber-800">{stats.conversionRate}%</div>
                <div className="text-xs text-amber-600">Conversion rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white overflow-hidden"
      >
        {/* Background Animation - Only on initial load */}
        {!hasInitiallyLoaded && (
          <div className="absolute inset-0 opacity-20">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"
            />
            <motion.div
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"
            />
          </div>
        )}

        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-6 text-center">💼 Admin Control Center</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "User Management", icon: "👤", action: "Manage users", color: "from-blue-400 to-blue-600" },
              { title: "Send Broadcast", icon: "📢", action: "Mass notification", color: "from-green-400 to-green-600" },
              { title: "Review Reports", icon: "🔍", action: "Moderate content", color: "from-yellow-400 to-yellow-600" },
              { title: "Analytics Deep Dive", icon: "📊", action: "Detailed insights", color: "from-purple-400 to-purple-600" },
            ].map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${action.color} backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-2xl transition-all border border-white/20 group`}
              >
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="text-4xl mb-3"
                >
                  {action.icon}
                </motion.div>
                <div className="font-bold text-lg mb-1 group-hover:text-white transition-colors">
                  {action.title}
                </div>
                <div className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  {action.action}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
