import { inngest } from "../inngest/index.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import { pushNotification } from "../services/notificationService.js";

/**
 * Create a new leave application
 * Validates employee status, leave dates, and required fields
 * Sets initial status to "PENDING" for admin approval
 */
export const createLeave = async (req, res) => {
  try {
    // Get user ID from session
    const session = req.session;

    // Fetch employee record linked to the current user
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // Check if employee account is deactivated
    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot apply for leave",
      });
    }

    // Extract leave details from request body
    const { type, startDate, endDate, reason } = req.body;

    // Validate that all required fields are provided
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Get today's date for validation (ignoring time component)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ensure leave dates are in the future (cannot apply for past leave)
    if (new Date(startDate) <= today || new Date(endDate) <= today) {
      return res
        .status(400)
        .json({ error: "Leave dates must be in the future" });
    }

    // Ensure end date is on or after start date
    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json({ error: "End date must be on or after start date" });
    }

    // Create new leave application with PENDING status
    const leave = await LeaveApplication.create({
      employeeId: employee._id,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "PENDING",
    });

    await inngest.send({
      name: "leave/pending",
      data: { LeaveApplicationId: leave._id },
    });

    await pushNotification({
      title: "New leave request",
      message: `${employee.firstName} ${employee.lastName} submitted a ${type} leave request.`,
      senderRole: "SYSTEM",
      type: "LEAVE_PENDING",
      targetRole: "ADMIN",
      metadata: { leaveId: leave._id.toString() },
    });

    return res.json({ success: true, data: leave });
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};

// Get leave applications
// Returns all leaves for admin, or only leaves for current employee if not admin
export const getLeave = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";

    // Admin: Retrieve all leave applications with optional status filter
    if (isAdmin) {
      // Get status filter from query parameters (e.g., APPROVED, REJECTED, PENDING)
      const status = req.query.status;
      const where = status ? { status } : {};

      // Fetch all leave applications, populated with employee details
      const leaves = await LeaveApplication.find(where)
        .populate("employeeId")
        .sort({ createdAt: -1 });

      // Format data with string IDs for frontend compatibility
      const data = leaves.map((leave) => {
        const obj = leave.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId?._id?.toString(),
        };
      });
      return res.json({ data });
    } else {
      // Employee: Retrieve only their own leave applications
      const employee = await Employee.findOne({
        userId: session.userId,
      }).lean();
      if (!employee)
        return res.status(404).json({ error: "Employee not found" });

      // Fetch leave applications for this employee, sorted by creation date
      const leaves = await LeaveApplication.find({
        employeeId: employee._id,
      })
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        data: leaves,
        employee: { ...employee, id: employee._id.toString() },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};

//Update leave status
// Admin can update leave application status to APPROVED, REJECTED, or PENDING
export const updateLeaveStatus = async (req, res) => {
  try {
    // Extract status from request body
    const { status } = req.body;

    // Validate that status is one of the allowed values
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Update the leave application with new status and return updated document
    const leave = await LeaveApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      { returnDocument: "after" },
    ).populate("employeeId");

    if (leave?.employeeId) {
      const employeeUserId =
        leave.employeeId.userId?.toString() ||
        leave.employeeId.UserId?.toString();

      if (employeeUserId) {
        await pushNotification({
          title: "Leave status updated",
          message: `Your leave request has been ${status.toLowerCase()}.`,
          senderRole: "SYSTEM",
          type: "LEAVE_STATUS",
          recipientUserId: employeeUserId,
          metadata: {
            leaveId: leave._id.toString(),
            status,
          },
        });
      }
    }

    return res.json({ success: true, data: leave });
  } catch (error) {
    return res.status(500).json({ error: "failed" });
  }
};
