import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    senderRole: {
      type: String,
      enum: ["ADMIN", "SYSTEM", "EMPLOYEE"],
      default: "SYSTEM",
    },
    type: {
      type: String,
      enum: ["GENERAL", "LEAVE_PENDING", "LEAVE_STATUS"],
      default: "GENERAL",
    },
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    targetRole: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE"],
      default: null,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
