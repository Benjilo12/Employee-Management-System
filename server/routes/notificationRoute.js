import { Router } from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import {
  deleteNotification,
  getNotifications,
  sendNotification,
} from "../controllers/notificationController.js";

const notificationRouter = Router();

notificationRouter.get("/", protect, getNotifications);
notificationRouter.post("/", protect, protectAdmin, sendNotification);
notificationRouter.delete("/:id", protect, deleteNotification);

export default notificationRouter;
