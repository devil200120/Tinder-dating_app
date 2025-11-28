import React, { useEffect, useState } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "loading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "backdrop-blur-sm border shadow-lg";

    switch (toast.type) {
      case "success":
        return `${baseStyles} bg-green-50/90 border-green-200 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50/90 border-red-200 text-red-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50/90 border-yellow-200 text-yellow-800`;
      case "loading":
        return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-white/90 border-gray-200 text-gray-800`;
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out mb-3 mx-4
        ${
          isVisible && !isRemoving
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }
      `}
    >
      <div
        className={`
        relative rounded-xl p-4 pr-12 max-w-sm w-full
        ${getStyles()}
      `}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="font-semibold text-sm mb-1">{toast.title}</p>
            )}
            <p className="text-sm leading-5">{toast.message}</p>
            {toast.description && (
              <p className="text-xs mt-1 opacity-75">{toast.description}</p>
            )}
          </div>
        </div>

        {/* Close button */}
        {toast.type !== "loading" && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 hover:bg-black/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Progress bar for timed toasts */}
        {toast.duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-current opacity-60 rounded-b-xl animate-progress"
              style={{
                animationDuration: `${toast.duration}ms`,
                animationTimingFunction: "linear",
                animationFillMode: "forwards",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;
