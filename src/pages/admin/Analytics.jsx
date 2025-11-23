import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("users");
  const [isRealTime, setIsRealTime] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [120, 145, 168, 142, 189, 201, 235],
    matchesData: [450, 523, 478, 612, 589, 634, 702],
    revenueData: [1250, 1840, 1650, 2100, 1980, 2340, 2650],
    engagementData: [67, 72, 69, 78, 75, 81, 84],
  });

  const [insights, setInsights] = useState({
    totalRevenue: 89420.5,
    avgUserValue: 24.65,
    retentionRate: 73.2,
    conversionRate: 12.8,
    churnRate: 8.4,
    lifetimeValue: 187.5,
  });

  // Real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setAnalyticsData((prev) => ({
        ...prev,
        userGrowth: prev.userGrowth.map(
          (val) => val + Math.floor(Math.random() * 10) - 5
        ),
        matchesData: prev.matchesData.map((val) =>
          Math.max(0, val + Math.floor(Math.random() * 20) - 10)
        ),
        revenueData: prev.revenueData.map((val) =>
          Math.max(0, val + Math.floor(Math.random() * 100) - 50)
        ),
      }));

      setInsights((prev) => ({
        ...prev,
        totalRevenue: prev.totalRevenue + (Math.random() * 50 - 25),
        retentionRate: Math.max(
          60,
          Math.min(90, prev.retentionRate + (Math.random() - 0.5) * 2)
        ),
        conversionRate: Math.max(
          8,
          Math.min(20, prev.conversionRate + (Math.random() - 0.5) * 1)
        ),
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const timeframeOptions = [
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "1y", label: "1 Year" },
  ];

  const metricOptions = [
    { value: "users", label: "User Growth", icon: "👥", color: "blue" },
    { value: "matches", label: "Matches", icon: "💕", color: "pink" },
    { value: "revenue", label: "Revenue", icon: "💰", color: "green" },
    { value: "engagement", label: "Engagement", icon: "🎯", color: "purple" },
  ];

  const getCurrentData = () => {
    switch (selectedMetric) {
      case "users":
        return analyticsData.userGrowth;
      case "matches":
        return analyticsData.matchesData;
      case "revenue":
        return analyticsData.revenueData;
      case "engagement":
        return analyticsData.engagementData;
      default:
        return analyticsData.userGrowth;
    }
  };

  const getMetricColor = () => {
    const metric = metricOptions.find((m) => m.value === selectedMetric);
    switch (metric?.color) {
      case "blue":
        return "from-blue-500 to-cyan-500";
      case "pink":
        return "from-pink-500 to-rose-500";
      case "green":
        return "from-green-500 to-emerald-500";
      case "purple":
        return "from-purple-500 to-indigo-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  const AnalyticsCard = ({
    title,
    value,
    change,
    icon,
    gradient,
    subtitle,
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className={`relative bg-gradient-to-br ${gradient} p-6 rounded-3xl shadow-2xl border border-white/20 overflow-hidden cursor-pointer group`}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full"
        />
      </div>

      {/* Real-time indicator */}
      {isRealTime && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full shadow-lg"
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="text-5xl filter drop-shadow-lg"
          >
            {icon}
          </motion.div>
          <div className="text-right">
            <div className={`text-xs text-white/80 mb-1`}>{subtitle}</div>
            <div
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                change >= 0
                  ? "bg-green-400/20 text-green-100"
                  : "bg-red-400/20 text-red-100"
              }`}
            >
              {change >= 0 ? "📈" : "📉"} {Math.abs(change)}%
            </div>
          </div>
        </div>

        <h3 className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wide">
          {title}
        </h3>

        <div className="text-white text-3xl font-bold drop-shadow-lg">
          {typeof value === "number"
            ? value > 1000
              ? `${(value / 1000).toFixed(1)}K`
              : value.toLocaleString()
            : value}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            📊 Advanced Analytics
          </h1>
          <p className="text-gray-600 text-lg">
            Deep insights and performance metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            {timeframeOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeframe(option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  timeframe === option.value
                    ? "bg-indigo-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>

          {/* Real-time Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRealTime(!isRealTime)}
            className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 ${
              isRealTime
                ? "bg-red-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isRealTime ? "bg-white" : "bg-gray-400"
              }`}
            />
            <span>Real-time</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <AnalyticsCard
          title="Total Revenue"
          value={`$${insights.totalRevenue.toFixed(0)}`}
          change={18.5}
          icon="💰"
          gradient="from-green-500 to-emerald-600"
          subtitle="This month"
        />
        <AnalyticsCard
          title="Avg User Value"
          value={`$${insights.avgUserValue.toFixed(2)}`}
          change={7.2}
          icon="💎"
          gradient="from-blue-500 to-cyan-600"
          subtitle="Per user"
        />
        <AnalyticsCard
          title="Retention Rate"
          value={`${insights.retentionRate.toFixed(1)}%`}
          change={5.8}
          icon="🎯"
          gradient="from-purple-500 to-indigo-600"
          subtitle="30-day"
        />
        <AnalyticsCard
          title="Conversion Rate"
          value={`${insights.conversionRate.toFixed(1)}%`}
          change={12.3}
          icon="🚀"
          gradient="from-pink-500 to-rose-600"
          subtitle="Free to Premium"
        />
        <AnalyticsCard
          title="Churn Rate"
          value={`${insights.churnRate.toFixed(1)}%`}
          change={-2.1}
          icon="📉"
          gradient="from-orange-500 to-red-600"
          subtitle="Monthly"
        />
        <AnalyticsCard
          title="Lifetime Value"
          value={`$${insights.lifetimeValue.toFixed(0)}`}
          change={15.7}
          icon="⏳"
          gradient="from-teal-500 to-cyan-600"
          subtitle="Avg LTV"
        />
      </motion.div>

      {/* Interactive Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Performance Trends
          </h2>

          {/* Metric Selector */}
          <div className="flex items-center space-x-2">
            {metricOptions.map((metric) => (
              <motion.button
                key={metric.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMetric(metric.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedMetric === metric.value
                    ? `bg-gradient-to-r ${getMetricColor()} text-white shadow-lg`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{metric.icon}</span>
                <span>{metric.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="relative h-80 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-end justify-between h-full space-x-2">
            {getCurrentData().map((value, index) => {
              const maxValue = Math.max(...getCurrentData());
              const height = (value / maxValue) * 100;
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

              return (
                <motion.div
                  key={index}
                  className="flex-1 flex flex-col items-center group"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      delay: 0.6 + index * 0.1,
                      duration: 0.8,
                      type: "spring",
                    }}
                    className={`w-full bg-gradient-to-t ${getMetricColor()} rounded-t-lg relative overflow-hidden cursor-pointer`}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{ x: [-100, 100] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ width: "50%" }}
                    />

                    {/* Hover tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value.toLocaleString()}
                    </div>
                  </motion.div>

                  <div className="mt-3 text-sm font-medium text-gray-600">
                    {days[index]}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demographic Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            🌍 User Demographics
          </h3>

          <div className="space-y-4">
            {[
              {
                country: "United States",
                users: 45.2,
                flag: "🇺🇸",
                color: "blue",
              },
              {
                country: "United Kingdom",
                users: 23.1,
                flag: "🇬🇧",
                color: "red",
              },
              { country: "Canada", users: 12.8, flag: "🇨🇦", color: "green" },
              { country: "Australia", users: 8.9, flag: "🇦🇺", color: "yellow" },
              { country: "Germany", users: 6.3, flag: "🇩🇪", color: "purple" },
              { country: "Others", users: 3.7, flag: "🌐", color: "gray" },
            ].map((item, index) => (
              <motion.div
                key={item.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <span className="text-2xl">{item.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">
                      {item.country}
                    </span>
                    <span className="font-bold text-gray-800">
                      {item.users}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.users}%` }}
                      transition={{ delay: 1 + index * 0.1, duration: 1 }}
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        item.color === "blue"
                          ? "from-blue-500 to-blue-600"
                          : item.color === "red"
                          ? "from-red-500 to-red-600"
                          : item.color === "green"
                          ? "from-green-500 to-green-600"
                          : item.color === "yellow"
                          ? "from-yellow-500 to-yellow-600"
                          : item.color === "purple"
                          ? "from-purple-500 to-purple-600"
                          : "from-gray-500 to-gray-600"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Behavioral Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            🧠 Behavioral Insights
          </h3>

          <div className="space-y-6">
            {[
              {
                insight: "Peak usage hours",
                value: "8-10 PM",
                description: "Users are most active during evening hours",
                icon: "⏰",
                trend: "+34%",
              },
              {
                insight: "Avg session duration",
                value: "28.5 min",
                description: "Users spend quality time browsing profiles",
                icon: "📱",
                trend: "+12%",
              },
              {
                insight: "Message response rate",
                value: "67.8%",
                description: "High engagement in conversations",
                icon: "💬",
                trend: "+8%",
              },
              {
                insight: "Profile completion",
                value: "84.2%",
                description: "Most users complete their profiles",
                icon: "✅",
                trend: "+15%",
              },
            ].map((item, index) => (
              <motion.div
                key={item.insight}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 capitalize">
                        {item.insight}
                      </h4>
                      <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {item.trend}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      {item.value}
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Export & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white"
      >
        <div>
          <h3 className="text-2xl font-bold mb-2">Export Analytics Report</h3>
          <p className="text-indigo-100">
            Generate comprehensive reports for stakeholders
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-all border border-white/20"
          >
            📊 Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            📄 Generate PDF Report
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
