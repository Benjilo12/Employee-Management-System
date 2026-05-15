import Notification from "../models/Notification.js";
import { getIO } from "../socket/index.js";

const toPayload = (notification) => ({
  id: notification._id.toString(),
  title: notification.title,
  message: notification.message,
  senderRole: notification.senderRole,
  type: notification.type,
  metadata: notification.metadata,
  createdAt: notification.createdAt,
});

export const pushNotification = async ({
  title,
  message,
  senderRole = "SYSTEM",
  type = "GENERAL",
  recipientUserId = null,
  targetRole = null,
  metadata = {},
}) => {
  const notification = await Notification.create({
    title,
    message,
    senderRole,
    type,
    recipientUserId,
    targetRole,
    metadata,
  });

  const payload = toPayload(notification);
  const socket = getIO();

  if (recipientUserId) {
    socket.to(`user:${recipientUserId}`).emit("notification", payload);
  } else if (targetRole) {
    socket.to(`role:${targetRole}`).emit("notification", payload);
  } else {
    socket.emit("notification", payload);
  }

  return notification;
};
