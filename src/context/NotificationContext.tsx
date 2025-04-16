import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  notification: string | null;
  type: NotificationType | null;
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [type, setType] = useState<NotificationType | null>(null);

  const showNotification = (message: string, type: NotificationType = "info", duration = 3000) => {
    if (timeoutId) clearTimeout(timeoutId); 
    setNotification(message);
    setType(type);
    const newTimeout = setTimeout(() => {
          setNotification(null);
      setType(null);
        }, duration);
    
        setTimeoutId(newTimeout);
  };

  // const showNotification = (message: string, duration = 3000) => {
  //   if (timeoutId) clearTimeout(timeoutId); 

  //   setNotification(message);

  //   const newTimeout = setTimeout(() => {
  //     setNotification(null);
  //   }, duration);

  //   setTimeoutId(newTimeout);
  // };
  return (
    <NotificationContext.Provider value={{ notification, type, showNotification }}>
      {children}
      {notification && (
        <div
          className="notification"
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: type === "success" ? "green" : type === "error" ? "red" : type === "warning" ? "orange" : "blue",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 9999,
          }}
        >
          {notification}
        </div>
      )}
    </NotificationContext.Provider>
  );
  
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
