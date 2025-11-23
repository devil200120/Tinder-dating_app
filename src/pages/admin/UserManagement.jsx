import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      age: 28,
      location: "New York, NY",
      joinDate: "2024-01-15",
      status: "active",
      subscription: "premium",
      matches: 45,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616c7d6b9d1?w=150",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      age: 32,
      location: "Los Angeles, CA",
      joinDate: "2024-02-08",
      status: "active",
      subscription: "gold",
      matches: 67,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      age: 26,
      location: "Chicago, IL",
      joinDate: "2024-01-22",
      status: "banned",
      subscription: "free",
      matches: 23,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      lastActive: "1 week ago",
      banReason: "Inappropriate content",
    },
    {
      id: 4,
      name: "David Lee",
      email: "david.lee@email.com",
      age: 29,
      location: "Seattle, WA",
      joinDate: "2024-03-01",
      status: "active",
      subscription: "platinum",
      matches: 89,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      lastActive: "30 minutes ago",
    },
    {
      id: 5,
      name: "Lisa Garcia",
      email: "lisa.garcia@email.com",
      age: 31,
      location: "Miami, FL",
      joinDate: "2024-02-14",
      status: "inactive",
      subscription: "premium",
      matches: 56,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      lastActive: "3 days ago",
    },
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesSubscription =
        subscriptionFilter === "all" ||
        user.subscription === subscriptionFilter;

      return matchesSearch && matchesStatus && matchesSubscription;
    });

    setFilteredUsers(filtered);
  }, [users, searchQuery, statusFilter, subscriptionFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-yellow-500";
      case "banned":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case "free":
        return "bg-gray-500";
      case "premium":
        return "bg-blue-500";
      case "gold":
        return "bg-yellow-500";
      case "platinum":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleUserAction = (userId, action) => {
    setUsers(
      users
        .map((user) => {
          if (user.id === userId) {
            if (action === "ban") {
              return {
                ...user,
                status: "banned",
                banReason: "Banned by admin",
              };
            } else if (action === "unban") {
              return { ...user, status: "active", banReason: undefined };
            } else if (action === "delete") {
              // In real implementation, this would remove the user
              return { ...user, status: "deleted" };
            }
          }
          return user;
        })
        .filter((user) => user.status !== "deleted")
    );
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          👥 User Management
        </h1>
        <p className="text-gray-600 text-sm">
          Monitor and manage your community members
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-5 border border-purple-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
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
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>

          {/* Subscription Filter */}
          <select
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>

          {/* Add User Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all text-sm"
          >
            + Add User
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/30 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-xl font-bold text-blue-600">
              {filteredUsers.length}
            </div>
            <div className="text-xs text-blue-500 font-medium">Total Users</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200/30 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-xl font-bold text-green-600">
              {filteredUsers.filter((u) => u.status === "active").length}
            </div>
            <div className="text-xs text-green-500 font-medium">Active</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200/30 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-xl font-bold text-yellow-600">
              {filteredUsers.filter((u) => u.subscription !== "free").length}
            </div>
            <div className="text-xs text-yellow-500 font-medium">Premium</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200/30 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-xl font-bold text-red-600">
              {filteredUsers.filter((u) => u.status === "banned").length}
            </div>
            <div className="text-xs text-red-500 font-medium">Banned</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Matches
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50/30 transition-all duration-200 group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                            user.status
                          )}`}
                        ></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Age {user.age} • {user.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-800">{user.email}</div>
                    <div className="text-xs text-gray-500">
                      Joined {user.joinDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : user.status === "banned"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {user.status === "active" && "🟢"}
                        {user.status === "banned" && "🔴"}
                        {user.status === "inactive" && "🟡"}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </span>
                    </div>
                    {user.banReason && (
                      <div className="text-xs text-red-500 mt-1 bg-red-50 px-2 py-1 rounded">
                        {user.banReason}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm ${getSubscriptionColor(
                        user.subscription
                      )}`}
                    >
                      {user.subscription === "platinum" && "💎"}
                      {user.subscription === "gold" && "🥇"}
                      {user.subscription === "premium" && "⭐"}
                      {user.subscription === "free" && "📱"}
                      <span className="ml-1 capitalize">
                        {user.subscription}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        {user.matches}
                      </div>
                      <div className="text-xs text-gray-500">matches</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-800 font-medium">
                      {user.lastActive}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openUserModal(user)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                        title="View Details"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </motion.button>
                      {user.status === "banned" ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUserAction(user.id, "unban")}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                          title="Unban User"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUserAction(user.id, "ban")}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Ban User"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUserAction(user.id, "delete")}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredUsers.length} users
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header with background */}
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-5 rounded-t-2xl text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-3 border-white shadow-lg">
                        <img
                          src={selectedUser.avatar}
                          alt={selectedUser.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                          selectedUser.status
                        )} rounded-full border-2 border-white`}
                      ></div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                      <p className="text-white/90 text-sm">
                        Age {selectedUser.age} • {selectedUser.location}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          selectedUser.status === "active"
                            ? "bg-green-400/20 text-green-100"
                            : selectedUser.status === "banned"
                            ? "bg-red-400/20 text-red-100"
                            : "bg-yellow-400/20 text-yellow-100"
                        }`}
                      >
                        {selectedUser.status === "active" && "🟢"}
                        {selectedUser.status === "banned" && "🔴"}
                        {selectedUser.status === "inactive" && "🟡"}
                        <span className="ml-1 capitalize">
                          {selectedUser.status}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200">
                      <div className="text-xs text-gray-500 font-medium">
                        Email Address
                      </div>
                      <div className="font-semibold text-sm text-gray-800">
                        {selectedUser.email}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                      <div className="text-xs text-blue-600 font-medium">
                        Join Date
                      </div>
                      <div className="font-semibold text-sm text-blue-800">
                        {selectedUser.joinDate}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
                      <div className="text-xs text-purple-600 font-medium">
                        Subscription
                      </div>
                      <div className="font-semibold text-sm text-purple-800 capitalize flex items-center">
                        {selectedUser.subscription === "platinum" && "💎"}
                        {selectedUser.subscription === "gold" && "🥇"}
                        {selectedUser.subscription === "premium" && "⭐"}
                        {selectedUser.subscription === "free" && "📱"}
                        <span className="ml-1">
                          {selectedUser.subscription}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl border border-green-200">
                      <div className="text-xs text-green-600 font-medium">
                        Last Active
                      </div>
                      <div className="font-semibold text-sm text-green-800">
                        {selectedUser.lastActive}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedUser.matches}
                      </div>
                      <div className="text-xs text-blue-500 font-medium">
                        Total Matches
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="text-2xl font-bold text-green-600">
                        4.8
                      </div>
                      <div className="text-xs text-green-500 font-medium">
                        Rating
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="text-2xl font-bold text-purple-600">
                        23
                      </div>
                      <div className="text-xs text-purple-500 font-medium">
                        Photos
                      </div>
                    </motion.div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm shadow-md hover:shadow-lg"
                    >
                      💬 Send Message
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2.5 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors text-sm shadow-md hover:shadow-lg"
                    >
                      👁️ View Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-md hover:shadow-lg ${
                        selectedUser.status === "banned"
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {selectedUser.status === "banned"
                        ? "✅ Unban User"
                        : "🚫 Ban User"}
                    </motion.button>
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

export default UserManagement;
