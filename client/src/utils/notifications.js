const NOTIFICATIONS_STORAGE_KEY = "ems_notifications";

export const getNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const createNotification = ({ title, message, senderRole = "ADMIN" }) => {
  const notifications = getNotifications();
  const newNotification = {
    id: crypto.randomUUID(),
    title: title.trim(),
    message: message.trim(),
    senderRole,
    createdAt: new Date().toISOString(),
  };

  const updated = [newNotification, ...notifications];
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  return newNotification;
};
