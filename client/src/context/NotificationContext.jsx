import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { connectSocket, disconnectSocket } from "../api/socket";
import { useAuth } from "./authContext";

const NotificationContext = createContext(null);

const getReadStorageKey = (userId) => `ems_read_notifications_${userId}`;

const loadReadIds = (userId) => {
  if (!userId) return new Set();
  try {
    const raw = localStorage.getItem(getReadStorageKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

export function NotificationProvider({ children }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState(() => loadReadIds(user?.userId));

  useEffect(() => {
    setReadIds(loadReadIds(user?.userId));
  }, [user?.userId]);

  const persistReadIds = useCallback(
    (ids) => {
      if (!user?.userId) return;
      localStorage.setItem(
        getReadStorageKey(user.userId),
        JSON.stringify([...ids]),
      );
    },
    [user?.userId],
  );

  const markAsRead = useCallback(
    (id) => {
      setReadIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        persistReadIds(next);
        return next;
      });
    },
    [persistReadIds],
  );

  const markAllAsRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      persistReadIds(next);
      return next;
    });
  }, [notifications, persistReadIds]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds],
  );

  const isRead = useCallback((id) => readIds.has(id), [readIds]);

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.data || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const sendNotification = useCallback(
    async ({ title, message }) => {
      const { data } = await api.post("/notifications", { title, message });
      const sent = data.data;
      setNotifications((prev) => {
        if (prev.some((n) => n.id === sent.id)) return prev;
        return [sent, ...prev];
      });
      return sent;
    },
    [],
  );

  const deleteNotification = useCallback(
    async (id) => {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setReadIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        persistReadIds(next);
        return next;
      });
    },
    [persistReadIds],
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(token);
    if (!socket) return;

    const onNotification = (payload) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === payload.id)) return prev;
        return [payload, ...prev];
      });

      toast(payload.title, {
        icon: "🔔",
        duration: 5000,
      });
    };

    socket.on("notification", onNotification);

    return () => {
      socket.off("notification", onNotification);
      disconnectSocket();
    };
  }, [token]);

  const value = {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    sendNotification,
    markAsRead,
    markAllAsRead,
    isRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
