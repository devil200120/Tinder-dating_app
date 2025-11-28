// components/BlockUserModal.jsx
import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Shield, MessageCircle } from "lucide-react";
import { userService } from "../services/userService";
import { useToast } from "../context/ToastContext";

const BlockUserModal = ({ isOpen, onClose, user, onUserBlocked }) => {
  const [blockType, setBlockType] = useState("complete");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [reasons, setReasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchBlockReasons();
    }
  }, [isOpen]);

  const fetchBlockReasons = async () => {
    try {
      const response = await userService.getBlockReasons();
      setReasons(response.data);
    } catch (error) {
      console.error("Failed to fetch block reasons:", error);
    }
  };

  const handleBlock = async () => {
    if (!reason) {
      showToast("Please select a reason for blocking", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await userService.blockUser(
        user._id,
        reason,
        description,
        blockType
      );
      showToast(
        blockType === "complete"
          ? `${user.name} has been completely blocked`
          : `${user.name} has been blocked from ${blockType}`,
        "success"
      );
      onUserBlocked?.(response.data);
      onClose();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to block user",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setBlockType("complete");
    setReason("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 10000 }}
    >
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Block {user?.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose how to block this user
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Block Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Block Type
            </label>
            <div className="space-y-3">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  blockType === "complete"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                    : "border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500"
                }`}
                onClick={() => setBlockType("complete")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={blockType === "complete"}
                    onChange={() => setBlockType("complete")}
                    className="text-red-500"
                  />
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Block Completely
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Remove all interactions, matches, and messages
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  blockType === "messages"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/10"
                    : "border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500"
                }`}
                onClick={() => setBlockType("messages")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={blockType === "messages"}
                    onChange={() => setBlockType("messages")}
                    className="text-orange-500"
                  />
                  <MessageCircle className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Block Messages Only
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Prevent messaging but allow profile viewing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for blocking *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select a reason</option>
              {reasons.map((reasonOption) => (
                <option key={reasonOption.value} value={reasonOption.value}>
                  {reasonOption.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional context..."
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description.length}/500 characters
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                {blockType === "complete" ? (
                  <span>
                    <strong>Warning:</strong> This will permanently remove all
                    matches, messages, and interactions with this user. This
                    action cannot be undone.
                  </span>
                ) : (
                  <span>
                    <strong>Note:</strong> This will prevent messaging but they
                    can still view your profile and you may still see them in
                    discovery.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-dark-700 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBlock}
            disabled={!reason || isLoading}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Blocking...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Block User</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUserModal;
