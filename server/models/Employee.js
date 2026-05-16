import mongoose from "mongoose";
import { DEPARTMENTS } from "../constant/department.js";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    basicSalary: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    employmentStatus: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    joinDate: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    bio: { type: String, default: "" },
    department: { type: String, enum: DEPARTMENTS },
  },
  { timestamps: true },
);

employeeSchema.pre("validate", function (next) {
  if (!this.userId && this.UserId) {
    this.userId = this.UserId;
  }
  if (!this.UserId && this.userId) {
    this.UserId = this.userId;
  }
  if (typeof next === "function") next();
});

employeeSchema.post("init", function (doc) {
  if (!doc.userId && doc.UserId) {
    doc.userId = doc.UserId;
  }
  if (!doc.UserId && doc.userId) {
    doc.UserId = doc.userId;
  }
});

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
