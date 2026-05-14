// Import department constants (used for total department count)
import { DEPARTMENTS } from "../constant/department.js";

// Import database models
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import Payslip from "../models/PaySlip.js";

// Get dashboard data for both ADMIN and EMPLOYEE
export const getDashboard = async (req, res) => {
  try {
    // Get session info (contains userId and role)
    const session = req.session;

    // =========================
    // ADMIN DASHBOARD
    // =========================
    if (session.role === "ADMIN") {
      // Run all queries in parallel (faster)
      const [totalEmployees, todayAttendance, pendingLeaves] =
        await Promise.all([
          // Count all active employees (not deleted)
          Employee.countDocuments({ isDeleted: { $ne: true } }),

          // Count today's attendance records
          Attendance.countDocuments({
            date: {
              // Start of today (00:00)
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),

              // End of today (24:00)
              $lt: new Date(new Date().setHours(24, 0, 0, 0)),
            },
          }),

          // Count all pending leave requests
          LeaveApplication.countDocuments({ status: "PENDING" }),
        ]);

      // Send admin dashboard data
      return res.json({
        role: "ADMIN",
        totalEmployees,
        totalDepartments: DEPARTMENTS.length, // total departments
        todayAttendance,
        pendingLeaves,
      });
    }

    // =========================
    // EMPLOYEE DASHBOARD
    // =========================
    else {
      // Find employee based on logged-in userId
      const employee = await Employee.findOne({
        userId: session.userId,
      }).lean(); // lean() = returns plain JS object (faster)

      // If employee not found → error
      if (!employee)
        return res.status(404).json({ error: "Employee not found" });

      // Get today's date
      const today = new Date();

      // Run queries in parallel
      const [currentMonthAttendance, pendingLeaves, latestPayslip] =
        await Promise.all([
          // Count attendance for current month
          Attendance.countDocuments({
            employeeId: employee._id,
            date: {
              // First day of current month
              $gte: new Date(today.getFullYear(), today.getMonth(), 1),

              // First day of next month
              $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
            },
          }),

          // Count pending leave requests for this employee
          LeaveApplication.countDocuments({
            employeeId: employee._id,
            status: "PENDING",
          }),

          // Get latest payslip (most recent one)
          Payslip.findOne({ employeeId: employee._id })
            .sort({
              createdAt: -1, // descending → latest first
            })
            .lean(),
        ]);

      // Send employee dashboard data
      return res.json({
        role: "EMPLOYEE",

        // Spread employee data + convert _id to string
        employee: { ...employee, id: employee._id.toString() },

        currentMonthAttendance,
        pendingLeaves,

        // If payslip exists → format it, else return null
        latestPayslip: latestPayslip
          ? { ...latestPayslip, id: latestPayslip._id.toString() }
          : null,
      });
    }
  } catch (error) {
    // Log error in console
    console.error("Dashboard error:", error);

    // Send server error response
    return res.status(500).json({ error: "failed" });
  }
};
