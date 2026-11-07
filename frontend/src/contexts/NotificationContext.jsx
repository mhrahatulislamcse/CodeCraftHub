import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let toastIdCounter = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastIdCounter;
    const toast = { id, type, title, message };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toast = {
    success: (message, title = 'Success', duration = 4000) => 
      addToast({ type: 'success', title, message, duration }),
    error: (message, title = 'Error', duration = 5000) => 
      addToast({ type: 'error', title, message, duration }),
    warning: (message, title = 'Warning', duration = 4500) => 
      addToast({ type: 'warning', title, message, duration }),
    info: (message, title = 'Information', duration = 4000) => 
      addToast({ type: 'info', title, message, duration }),
  };

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

