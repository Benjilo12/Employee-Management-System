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

    const notDismissed = { dismissedBy: { $ne: session.userId } };

    const filter = isAdmin
      ? {
          $and: [
            notDismissed,
            {
              $or: [
                { targetRole: "ADMIN" },
                { recipientUserId: session.userId },
                { senderRole: "ADMIN" },
              ],
            },
          ],
        }
      : {
          $and: [
            notDismissed,
            {
              $or: [
                { targetRole: "EMPLOYEE" },
                { recipientUserId: session.userId },
              ],
            },
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

const adminCanAccess = (notification, userId) =>
  notification.senderRole === "ADMIN" ||
  notification.targetRole === "ADMIN" ||
  notification.recipientUserId?.toString() === userId;

const employeeCanAccess = (notification, userId) =>
  notification.targetRole === "EMPLOYEE" ||
  notification.recipientUserId?.toString() === userId;

export const deleteNotification = async (req, res) => {
  try {
    const session = req.session;
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (session.role === "ADMIN") {
      if (!adminCanAccess(notification, session.userId)) {
        return res
          .status(403)
          .json({ error: "Not allowed to delete this notification" });
      }

      // Permanently remove admin broadcasts; dismiss system alerts from admin view only
      if (
        notification.senderRole === "ADMIN" &&
        notification.type === "GENERAL"
      ) {
        await Notification.findByIdAndDelete(req.params.id);
      } else {
        await Notification.findByIdAndUpdate(req.params.id, {
          $addToSet: { dismissedBy: session.userId },
        });
      }

      return res.json({ success: true });
    }

    if (session.role === "EMPLOYEE") {
      if (!employeeCanAccess(notification, session.userId)) {
        return res
          .status(403)
          .json({ error: "Not allowed to delete this notification" });
      }

      await Notification.findByIdAndUpdate(req.params.id, {
        $addToSet: { dismissedBy: session.userId },
      });

      return res.json({ success: true });
    }

    return res.status(403).json({ error: "Not allowed to delete notifications" });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({ error: "Failed to delete notification" });
  }
};
