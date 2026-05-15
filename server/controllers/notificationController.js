import Notification from "../models/Notification.js";
import { pushNotification } from "../services/notificationService.js";

export const sendNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const notification = await pushNotification({
      title: title.trim(),
      message: message.trim(),
      senderRole: "ADMIN",
      type: "GENERAL",
      targetRole: "EMPLOYEE",
    });

    return res.json({
      success: true,
      data: {
        id: notification._id.toString(),
        title: notification.title,
        message: notification.message,
        senderRole: notification.senderRole,
        type: notification.type,
        createdAt: notification.createdAt,
      },
    });
  } catch (error) {
    console.error("Send notification error:", error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";

    const filter = isAdmin
      ? {
          $or: [
            { targetRole: "ADMIN" },
            { recipientUserId: session.userId },
            { senderRole: "ADMIN" },
          ],
        }
      : {
          $or: [
            { targetRole: "EMPLOYEE" },
            { recipientUserId: session.userId },
          ],
        };

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const data = notifications.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      message: n.message,
      senderRole: n.senderRole,
      type: n.type,
      metadata: n.metadata,
      createdAt: n.createdAt,
    }));

    return res.json({ data });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
