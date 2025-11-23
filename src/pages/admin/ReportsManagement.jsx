import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ReportsManagement = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      reporter: {
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616c7d6b9d1?w=150",
      },
      reportedUser: {
        name: "Alex Smith",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      },
      reason: "inappropriate_content",
      description:
        "User posted inappropriate photos and messages that made me uncomfortable.",
      status: "pending",
      priority: "high",
      createdAt: "2024-11-23T08:30:00Z",
      evidence: ["screenshot1.jpg", "screenshot2.jpg"],
    },
    {
      id: 2,
      reporter: {
        name: "Mike Johnson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      },
      reportedUser: {
        name: "Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      },
      reason: "harassment",
      description: "Continuous unwanted messages despite being blocked.",
      status: "reviewing",
      priority: "high",
      createdAt: "2024-11-22T15:45:00Z",
      reviewedBy: "Admin John",
      evidence: ["conversation_log.txt"],
    },
    {
      id: 3,
      reporter: {
        name: "Lisa Garcia",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      },
      reportedUser: {
        name: "David Lee",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      },
      reason: "fake_profile",
      description: "Using someone elses photos and false information.",
      status: "resolved",
      priority: "medium",
      createdAt: "2024-11-21T11:20:00Z",
      reviewedBy: "Admin Sarah",
      action: "account_suspended",
      evidence: ["reverse_image_search.jpg"],
    },
    {
      id: 4,
      reporter: {
        name: "Tom Brown",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      },
      reportedUser: {
        name: "Jessica White",
        avatar:
          "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150",
      },
      reason: "scam",
      description: "Asking for money and financial information.",
      status: "pending",
      priority: "critical",
      createdAt: "2024-11-23T09:15:00Z",
      evidence: ["payment_requests.jpg"],
    },
  ]);

  const [filteredReports, setFilteredReports] = useState(reports);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    let filtered = reports.filter((report) => {
      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || report.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
    setFilteredReports(filtered);
  }, [reports, statusFilter, priorityFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "reviewing":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      case "dismissed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-400";
      case "medium":
        return "bg-yellow-400";
      case "high":
        return "bg-orange-400";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getReasonIcon = (reason) => {
    switch (reason) {
      case "inappropriate_content":
        return "🚫";
      case "harassment":
        return "😠";
      case "fake_profile":
        return "🎭";
      case "spam":
        return "📧";
      case "scam":
        return "💰";
      case "underage":
        return "👶";
      case "violence":
        return "⚔️";
      default:
        return "⚠️";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleReportAction = (reportId, action, notes = "") => {
    setReports(
      reports.map((report) => {
        if (report.id === reportId) {
          return {
            ...report,
            status: action === "dismiss" ? "dismissed" : "resolved",
            action: action,
            actionNotes: notes,
            reviewedBy: "Current Admin",
          };
        }
        return report;
      })
    );
  };

  const openReportModal = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
          Reports Management
        </h1>
        <p className="text-gray-600 text-lg">
          Review and take action on user reports
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {reports.filter((r) => r.status === "pending").length}
              </div>
              <div className="text-white/90">Pending</div>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-400 to-purple-500 p-6 rounded-2xl text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {reports.filter((r) => r.status === "reviewing").length}
              </div>
              <div className="text-white/90">Reviewing</div>
            </div>
            <div className="text-4xl">🔍</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-2xl text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {reports.filter((r) => r.status === "resolved").length}
              </div>
              <div className="text-white/90">Resolved</div>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-red-400 to-pink-500 p-6 rounded-2xl text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {reports.filter((r) => r.priority === "critical").length}
              </div>
              <div className="text-white/90">Critical</div>
            </div>
            <div className="text-4xl">🚨</div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-red-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              📊 Generate Report
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-red-100 hover:shadow-2xl transition-all"
          >
            <div className="flex items-start space-x-4">
              {/* Priority Indicator */}
              <div
                className={`w-1 h-20 rounded-full ${getPriorityColor(
                  report.priority
                )}`}
              ></div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Reason Icon */}
                    <div className="text-3xl">
                      {getReasonIcon(report.reason)}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-800 capitalize">
                          {report.reason.replace("_", " ")}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(
                            report.priority
                          )}`}
                        >
                          {report.priority}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <img
                            src={report.reporter.avatar}
                            alt={report.reporter.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">
                              {report.reporter.name}
                            </span>{" "}
                            reported
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <img
                            src={report.reportedUser.avatar}
                            alt={report.reportedUser.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-600 font-medium">
                            {report.reportedUser.name}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{report.description}</p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📅 {formatDate(report.createdAt)}</span>
                        {report.evidence && (
                          <span>
                            📎 {report.evidence.length} evidence files
                          </span>
                        )}
                        {report.reviewedBy && (
                          <span>👤 Reviewed by {report.reviewedBy}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openReportModal(report)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </motion.button>

                    {report.status === "pending" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleReportAction(report.id, "review")
                          }
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                        >
                          Start Review
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleReportAction(report.id, "ban_user")
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          Ban User
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {showReportModal && selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-t-3xl text-white">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    ✕
                  </button>

                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">
                      {getReasonIcon(selectedReport.reason)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold capitalize">
                        {selectedReport.reason.replace("_", " ")} Report
                      </h2>
                      <p className="text-white/90">
                        Report ID: #{selectedReport.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Report Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        Reporter Information
                      </h3>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <img
                          src={selectedReport.reporter.avatar}
                          alt={selectedReport.reporter.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <div className="font-medium">
                            {selectedReport.reporter.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Report submitted
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        Reported User
                      </h3>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <img
                          src={selectedReport.reportedUser.avatar}
                          alt={selectedReport.reportedUser.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <div className="font-medium">
                            {selectedReport.reportedUser.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Reported user
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Report Description */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      Description
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-700">
                        {selectedReport.description}
                      </p>
                    </div>
                  </div>

                  {/* Evidence */}
                  {selectedReport.evidence && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">
                        Evidence Files
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedReport.evidence.map((file, index) => (
                          <div
                            key={index}
                            className="p-3 bg-blue-50 rounded-xl text-center"
                          >
                            <div className="text-2xl mb-2">📎</div>
                            <div className="text-sm font-medium text-blue-700">
                              {file}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Take Action
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button className="p-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors">
                        ⚠️ Warning
                      </button>
                      <button className="p-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors">
                        🚫 Temporary Ban
                      </button>
                      <button className="p-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
                        ❌ Permanent Ban
                      </button>
                      <button className="p-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors">
                        ✖️ Dismiss Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsManagement;
