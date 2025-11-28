import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Global error handlers to prevent page reloads
window.addEventListener("error", (event) => {
  console.error("Global error caught:", event.error);
  // Prevent the default browser behavior (page reload)
  event.preventDefault();
  return false;
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  // Prevent the default browser behavior
  event.preventDefault();
  return false;
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
