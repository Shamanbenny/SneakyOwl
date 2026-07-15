"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

type NotificationItem = {
  id: string;
  message: string;
  type: NotificationType;
  isExiting: boolean;
};

type NotificationContextValue = {
  notify: (message: string, type?: NotificationType) => void;
};

const NOTIFICATION_DURATION = 5000;
const NOTIFICATION_EXIT_DURATION = 300;

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const nextIdRef = useRef(0);
  const timersRef = useRef<Map<string, number>>(new Map());

  const removeNotification = useCallback((id: string) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
    timersRef.current.delete(id);
  }, []);

  const dismissNotification = useCallback(
    (id: string) => {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, isExiting: true }
            : notification,
        ),
      );
      window.setTimeout(() => removeNotification(id), NOTIFICATION_EXIT_DURATION);
    },
    [removeNotification],
  );

  const notify = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = `${Date.now()}-${nextIdRef.current++}`;

      setNotifications((current) => [
        ...current,
        { id, isExiting: false, message, type },
      ]);

      const timer = window.setTimeout(
        () => dismissNotification(id),
        NOTIFICATION_DURATION - NOTIFICATION_EXIT_DURATION,
      );
      timersRef.current.set(id, timer);
    },
    [dismissNotification],
  );

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    },
    [],
  );

  const contextValue = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="site-notification-stack" aria-live="polite">
        {notifications.map((notification) => (
          <div
            className="site-notification"
            data-exiting={notification.isExiting ? "true" : undefined}
            data-type={notification.type}
            key={notification.id}
            role={notification.type === "error" ? "alert" : "status"}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }

  return context;
};
