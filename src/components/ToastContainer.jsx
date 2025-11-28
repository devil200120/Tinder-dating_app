import React from "react";
import { createPortal } from "react-dom";
import { useToast } from "../context/ToastContext";
import Toast from "./Toast";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="flex flex-col-reverse pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>,
    document.body
  );
};

export default ToastContainer;
