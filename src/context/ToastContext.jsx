import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: "info",
      duration: 5000,
      ...toast,
      createdAt: Date.now(),
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Helper methods for different toast types
  const toast = {
    success: (message, options = {}) =>
      addToast({ type: "success", message, ...options }),
    error: (message, options = {}) =>
      addToast({ type: "error", message, ...options }),
    warning: (message, options = {}) =>
      addToast({ type: "warning", message, ...options }),
    info: (message, options = {}) =>
      addToast({ type: "info", message, ...options }),
    loading: (message, options = {}) => {
      const id = addToast({
        type: "loading",
        message,
        duration: 0,
        ...options,
      });
      return id;
    },
    removeToast: removeToast, // Expose removeToast function
    removeAllToasts: removeAllToasts,
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    toast,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
