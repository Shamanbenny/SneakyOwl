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
import { FaCheck, FaCopy } from "react-icons/fa6";

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
  const [copiedNotificationId, setCopiedNotificationId] = useState<string | null>(
    null,
  );
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

  const copyErrorMessage = useCallback(async (notification: NotificationItem) => {
    try {
      await navigator.clipboard.writeText(notification.message);
      setCopiedNotificationId(notification.id);
      window.setTimeout(() => {
        setCopiedNotificationId((current) =>
          current === notification.id ? null : current,
        );
      }, 1500);
    } catch {
      // Clipboard access can be unavailable in insecure or restricted contexts.
    }
  }, []);

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
            <span className="min-w-0 flex-1">{notification.message}</span>
            {notification.type === "error" ? (
              <button
                aria-label="Copy error message"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-current opacity-75 transition hover:bg-white/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50"
                onClick={() => void copyErrorMessage(notification)}
                title={
                  copiedNotificationId === notification.id
                    ? "Error message copied"
                    : "Copy error message"
                }
                type="button"
              >
                {copiedNotificationId === notification.id ? (
                  <FaCheck className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <FaCopy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            ) : null}
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
