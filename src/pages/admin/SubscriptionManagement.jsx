import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        email: "sarah.chen@email.com",
        avatar: "👩‍💼",
      },
      plan: "premium",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-12-15",
      amount: 99.99,
      renewalDate: "2024-12-15",
      paymentMethod: "card",
    },
    {
      id: 2,
      user: {
        name: "Mike Johnson",
        email: "mike.johnson@email.com",
        avatar: "👨‍🎨",
      },
      plan: "gold",
      status: "active",
      startDate: "2024-02-08",
      endDate: "2025-02-08",
      amount: 199.99,
      renewalDate: "2025-02-08",
      paymentMethod: "paypal",
    },
    {
      id: 3,
      user: {
        name: "David Lee",
        email: "david.lee@email.com",
        avatar: "🧑‍💻",
      },
      plan: "platinum",
      status: "cancelled",
      startDate: "2024-03-01",
      endDate: "2024-06-01",
      amount: 299.99,
      renewalDate: null,
      paymentMethod: "card",
    },
    {
      id: 4,
      user: {
        name: "Emma Wilson",
        email: "emma.wilson@email.com",
        avatar: "👩‍🔬",
      },
      plan: "premium",
      status: "active",
      startDate: "2024-04-10",
      endDate: "2024-10-10",
      amount: 99.99,
      renewalDate: "2024-10-10",
      paymentMethod: "card",
    },
    {
      id: 5,
      user: {
        name: "James Brown",
        email: "james.brown@email.com",
        avatar: "👨‍🚀",
      },
      plan: "gold",
      status: "expired",
      startDate: "2024-01-01",
      endDate: "2024-06-01",
      amount: 199.99,
      renewalDate: null,
      paymentMethod: "paypal",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editFormData, setEditFormData] = useState({
    plan: "",
    status: "",
    amount: "",
    endDate: "",
    renewalDate: "",
  });

  // Handler functions for buttons
  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const handleCancelSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setConfirmAction("cancel");
    setShowConfirmModal(true);
  };

  const handleReactivateSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setConfirmAction("reactivate");
    setShowConfirmModal(true);
  };

  const handleEditSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setEditFormData({
      plan: subscription.plan,
      status: subscription.status,
      amount: subscription.amount,
      endDate: subscription.endDate,
      renewalDate: subscription.renewalDate || "",
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-update amount based on plan selection
    if (field === "plan") {
      const planPrices = {
        premium: 99.99,
        gold: 199.99,
        platinum: 299.99,
      };
      setEditFormData((prev) => ({
        ...prev,
        [field]: value,
        amount: planPrices[value] || prev.amount,
      }));
    }
  };

  const handleSaveEdit = () => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubscription.id
          ? {
              ...sub,
              plan: editFormData.plan,
              status: editFormData.status,
              amount: parseFloat(editFormData.amount),
              endDate: editFormData.endDate,
              renewalDate: editFormData.renewalDate || null,
            }
          : sub
      )
    );
    setShowEditModal(false);
    setSelectedSubscription(null);
    setEditFormData({
      plan: "",
      status: "",
      amount: "",
      endDate: "",
      renewalDate: "",
    });
  };

  const confirmActionHandler = () => {
    if (confirmAction === "cancel") {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id
            ? { ...sub, status: "cancelled", renewalDate: null }
            : sub
        )
      );
    } else if (confirmAction === "reactivate") {
      const newRenewalDate = new Date();
      newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id
            ? {
                ...sub,
                status: "active",
                renewalDate: newRenewalDate.toISOString().split("T")[0],
              }
            : sub
        )
      );
    }
    setShowConfirmModal(false);
    setSelectedSubscription(null);
    setConfirmAction(null);
  };

  const getPlanConfig = (plan) => {
    switch (plan) {
      case "premium":
        return {
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          icon: "💎",
        };
      case "gold":
        return {
          color: "from-amber-500 to-yellow-600",
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          icon: "🏆",
        };
      case "platinum":
        return {
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
          textColor: "text-purple-700",
          icon: "👑",
        };
      default:
        return {
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          icon: "📦",
        };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          color: "bg-emerald-100 text-emerald-700",
          icon: "✅",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700",
          icon: "❌",
        };
      case "expired":
        return {
          color: "bg-gray-100 text-gray-700",
          icon: "⏰",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: "❓",
        };
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filterStatus !== "all" && sub.status !== filterStatus) return false;
    if (filterPlan !== "all" && sub.plan !== filterPlan) return false;
    return true;
  });

  const stats = {
    revenue: subscriptions.reduce(
      (sum, sub) => sum + (sub.status === "active" ? sub.amount : 0),
      0
    ),
    active: subscriptions.filter((s) => s.status === "active").length,
    total: subscriptions.length,
    cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 rounded-xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              💳 Subscription Management
            </h1>
            <p className="text-gray-300 text-sm">
              Monitor and manage subscription plans
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            <span className="text-xs font-medium">Live Revenue Tracking</span>
          </div>
        </div>
      </motion.div>

      {/* Revenue Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Monthly Revenue",
            value: `$${stats.revenue.toFixed(2)}`,
            color: "from-emerald-500 to-teal-600",
            icon: "💰",
          },
          {
            label: "Active Subscriptions",
            value: stats.active,
            color: "from-blue-500 to-indigo-600",
            icon: "✅",
          },
          {
            label: "Total Subscribers",
            value: stats.total,
            color: "from-purple-500 to-pink-600",
            icon: "👥",
          },
          {
            label: "Cancelled",
            value: stats.cancelled,
            color: "from-orange-500 to-red-500",
            icon: "📉",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-medium">
                  {stat.label}
                </p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </div>
              <span className="text-2xl opacity-80">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Filter by Plan
              </label>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                <option value="all">All Plans</option>
                <option value="premium">Premium</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredSubscriptions.length} of {subscriptions.length}{" "}
            subscriptions
          </div>
        </div>
      </motion.div>

      {/* Subscriptions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {filteredSubscriptions.map((subscription, index) => {
            const planConfig = getPlanConfig(subscription.plan);
            const statusConfig = getStatusConfig(subscription.status);

            return (
              <motion.div
                key={subscription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${planConfig.color} p-4`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
                        {subscription.user.avatar}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">
                          {subscription.user.name}
                        </h3>
                        <p className="text-xs text-white/80">
                          {subscription.user.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xl">{planConfig.icon}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${planConfig.bgColor} ${planConfig.textColor}`}
                    >
                      {subscription.plan.charAt(0).toUpperCase() +
                        subscription.plan.slice(1)}{" "}
                      Plan
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} flex items-center gap-1`}
                    >
                      <span className="text-xs">{statusConfig.icon}</span>
                      {subscription.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-semibold text-gray-800">
                        ${subscription.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="text-gray-700">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">End Date:</span>
                      <span className="text-gray-700">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {subscription.renewalDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Next Renewal:</span>
                        <span className="text-green-600 font-medium">
                          {new Date(
                            subscription.renewalDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment:</span>
                      <span className="text-gray-700 capitalize">
                        {subscription.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(subscription)}
                      className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-all duration-200"
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditSubscription(subscription)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-all duration-200"
                    >
                      Edit
                    </motion.button>
                    {subscription.status === "active" ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancelSubscription(subscription)}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-all duration-200"
                      >
                        Cancel
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleReactivateSubscription(subscription)
                        }
                        className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-all duration-200"
                      >
                        Reactivate
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredSubscriptions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No subscriptions found
          </h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </motion.div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedSubscription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    Subscription Details
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-2xl">
                    {selectedSubscription.user.avatar}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {selectedSubscription.user.name}
                    </h4>
                    <p className="text-gray-500">
                      {selectedSubscription.user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600">Plan</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {selectedSubscription.plan}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600">Status</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {selectedSubscription.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600">Amount</p>
                    <p className="text-sm font-semibold text-gray-800">
                      ${selectedSubscription.amount}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600">Payment</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {selectedSubscription.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Start Date:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {new Date(
                        selectedSubscription.startDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">End Date:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {new Date(
                        selectedSubscription.endDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedSubscription.renewalDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Next Renewal:
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {new Date(
                          selectedSubscription.renewalDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedSubscription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    Edit Subscription
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEditModal(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-xl">
                    {selectedSubscription.user.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {selectedSubscription.user.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedSubscription.user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Plan Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan
                    </label>
                    <select
                      value={editFormData.plan}
                      onChange={(e) =>
                        handleEditFormChange("plan", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="premium">Premium - $99.99/year</option>
                      <option value="gold">Gold - $199.99/year</option>
                      <option value="platinum">Platinum - $299.99/year</option>
                    </select>
                  </div>

                  {/* Status Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        handleEditFormChange("status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="expired">Expired</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.amount}
                      onChange={(e) =>
                        handleEditFormChange("amount", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editFormData.endDate}
                      onChange={(e) =>
                        handleEditFormChange("endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Renewal Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renewal Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={editFormData.renewalDate}
                      onChange={(e) =>
                        handleEditFormChange("renewalDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveEdit}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedSubscription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">
                  {confirmAction === "cancel" ? "❌" : "✅"}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {confirmAction === "cancel"
                    ? "Cancel Subscription"
                    : "Reactivate Subscription"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {confirmAction === "cancel"
                    ? `Are you sure you want to cancel ${selectedSubscription.user.name}'s subscription?`
                    : `Are you sure you want to reactivate ${selectedSubscription.user.name}'s subscription?`}
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmActionHandler}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      confirmAction === "cancel"
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {confirmAction === "cancel"
                      ? "Cancel Subscription"
                      : "Reactivate"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionManagement;
