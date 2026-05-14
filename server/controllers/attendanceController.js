import { now } from "mongoose";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

/**
 * Clock in/out for employee
 * Handles check-in: Records initial attendance and detects if employee is late (after 9 AM)
 * Handles check-out: Calculates working hours and assigns day type (Full, Half, etc.)
 * POST /api/attendance
 */
export const clockInOut = async (req, res) => {
  try {
    // Get user session and find associated employee
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) return res.Status(404).json({ error: "Employee not found" });

    // Check if employee account is deactivated
    if (employee.isDeleted)
      return res.Status(403).json({
        erreor: "Your account is deactivated. You cannot clock in/out",
      });

    // Get today's date (ignoring time component) for attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance record already exists for today
    const existing = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    // CLOCK IN: Create new attendance record if no record exists for today
    if (!existing) {
      // Determine if employee is late (9 AM or later)
      const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
      const attendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      });
      return res.json({ success: true, type: "CHECK_IN", date: attendance });
    }
    // CLOCK OUT: Update record with check-out time and calculate working hours
    else if (!existing.checkOut) {
      // Calculate time difference between check-in and check-out
      const checkInTime = new Date(existing.checkIn).getTime();
      const diffMs = now.getTime() - checkInTime;
      const diffHours = diffMs / (1000 * 60 * 60);

      // Record check-out time
      existing.checkOut = now;

      // Calculate working hours and determine day type based on hours worked
      const workingHours = parseFloat(diffHours.toFixed(2));
      let dayType = "Half Day";
      if (workingHours >= 8) dayType = "Full Day";
      else if (workingHours >= 6) dayType = "Three Quarter Day";
      else if (workingHours >= 4) dayType = "Half Day";
      else dayType = "Short Day";

      // Update attendance record with working hours and day type
      existing.workingHours = workingHours;
      existing.dayType = dayType;

      await existing.save();
      return res.json({ success: true, type: "CHECK_OUT", data: existing });
    }
    // Already checked out: Return existing record
    else {
      return res.json({ success: true, type: "CHECK_OUT", data: existing });
    }
  } catch (error) {
    console.error("Attendance Error:", error);
    return res.status(500).json({ error: "Operation failed" });
  }
};

/**
 * Retrieve attendance history for employee
 * Returns attendance records limited by query parameter (default: 30 records)
 * Sorted by date in descending order (most recent first)
 * GET /api/attendance
 */
export const getAttendance = async (req, res) => {
  try {
    // Get user session and find associated employee
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) return res.Status(404).json({ error: "Employee not found" });

    // Parse limit parameter from query, default to 30 records
    const limit = parseInt(req.query.limit || 30);

    // Fetch attendance records for this employee, sorted by date (newest first)
    const history = await Attendance.find({ employeeId: employee._id })
      .sort({ date: -1 })
      .limit(limit);

    // Return attendance history with employee status information
    return res.json({
      data: history,
      employee: { isDeleted: employee.isDeleted },
    });
  } catch (error) {
    return res.Status(500).json({ error: "Operation failed attendance" });
  }
};
