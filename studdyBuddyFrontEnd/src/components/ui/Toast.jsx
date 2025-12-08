import React, { useState, useEffect, createContext, useContext } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const success = (msg) => showToast(msg, "success");
  const error = (msg) => showToast(msg, "error");
  const info = (msg) => showToast(msg, "info");

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: "14px 24px",
            marginBottom: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            background: t.type === "success" ? "#27ae60" : t.type === "error" ? "#e74c3c" : "#232D4B",
            color: "#fff",
            fontWeight: 500,
            animation: "slideIn 0.3s ease"
          }}>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
};