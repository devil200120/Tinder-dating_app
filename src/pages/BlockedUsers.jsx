// pages/BlockedUsers.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Trash2, Eye, Calendar } from "lucide-react";
import { userService } from "../services/userService";
import { useToast } from "../context/ToastContext";
import { formatTimestamp } from "../utils/helpers";
import Avatar from "../components/Avatar";

const BlockedUsers = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await userService.getBlockedUsers(page);
      setBlockedUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showToast("Failed to fetch blocked users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId, userName) => {
    try {
      setUnblockingId(userId);
      await userService.unblockUser(userId);
      setBlockedUsers((prev) =>
        prev.filter((block) => block.blocked._id !== userId)
      );
      showToast(`${userName} has been unblocked`, "success");
    } catch (error) {
      showToast("Failed to unblock user", "error");
    } finally {
      setUnblockingId(null);
    }
  };

  const getBlockTypeInfo = (blockType) => {
    switch (blockType) {
      case "complete":
        return {
          label: "Complete Block",
          color: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20",
        };
      case "messages":
        return {
          label: "Messages Only",
          color:
            "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20",
        };
      default:
        return {
          label: "Block",
          color:
            "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20",
        };
    }
  };

  const getReasonLabel = (reason) => {
    const reasonMap = {
      harassment: "Harassment or Bullying",
      inappropriate_content: "Inappropriate Content",
      spam: "Spam or Promotional Content",
      fake_profile: "Fake or Misleading Profile",
      inappropriate_behavior: "Inappropriate Behavior",
      other: "Other",
    };
    return reasonMap[reason] || reason;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading blocked users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Blocked Users
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {blockedUsers.length} blocked users
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {blockedUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Blocked Users
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              You haven't blocked any users yet. When you block someone, they'll
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {blockedUsers.map((block) => (
              <div
                key={block._id}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar
                      src={block.blocked.photos?.[0]?.url}
                      alt={block.blocked.name}
                      size="lg"
                      className="flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {block.blocked.name}
                        </h3>
                        {block.blocked.age && (
                          <span className="text-gray-500 dark:text-gray-400">
                            {block.blocked.age}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getBlockTypeInfo(block.blockType).color
                          }`}
                        >
                          {getBlockTypeInfo(block.blockType).label}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          • {getReasonLabel(block.reason)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Blocked {formatTimestamp(block.createdAt)}</span>
                      </div>

                      {block.description && (
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-dark-700 p-3 rounded-lg">
                          {block.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/profile/${block.blocked._id}`)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleUnblock(block.blocked._id, block.blocked.name)
                      }
                      disabled={unblockingId === block.blocked._id}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:cursor-not-allowed"
                    >
                      {unblockingId === block.blocked._id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>
                        {unblockingId === block.blocked._id
                          ? "Unblocking..."
                          : "Unblock"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                {pagination.hasPrev && (
                  <button
                    onClick={() =>
                      fetchBlockedUsers(pagination.currentPage - 1)
                    }
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <span className="px-4 py-2 bg-primary-500 text-white rounded-lg">
                  {pagination.currentPage} of {pagination.totalPages}
                </span>
                {pagination.hasNext && (
                  <button
                    onClick={() =>
                      fetchBlockedUsers(pagination.currentPage + 1)
                    }
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedUsers;
