import { Router } from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import {
  getNotifications,
  sendNotification,
} from "../controllers/notificationController.js";

const notificationRouter = Router();

notificationRouter.get("/", protect, getNotifications);
notificationRouter.post("/", protect, protectAdmin, sendNotification);

export default notificationRouter;
