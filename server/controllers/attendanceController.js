//clock in/Out for employee

import { now } from "mongoose";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

//Post /api/attendance
export const clockInOut = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) return res.Status(404).json({ error: "Employee not found" });
    if (employee.isDeleted)
      return res.Status(403).json({
        erreor: "Your account is deactivated. You cannot clock in/out",
      });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });
    if (!existing) {
      const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
      const attendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      });
      return res.json({ success: true, type: "CHECK_IN", date: attendance });
    } else if (!existing.checkOut) {
      const checkInTime = new Date(existing.checkIn).getTime();
      const diffMs = now.getTime() - checkInTime;
      const diffHours = diffMs / (1000 * 60 * 60);

      existing.checkOut = now;

      //Compute working hours and day type
      const workingHours = parseFloat(diffHours.toFixed(2));
      let dayType = "Half Day";
      if (workingHours >= 8) dayType = "Full Day";
      else if (workingHours >= 6) dayType = "Three Quarter Day";
      else if (workingHours >= 4) dayType = "Half Day";
      else dayType = "Short Day";

      existing.workingHours = workingHours;
      existing.dayType = dayType;

      await existing.save();
      return res.json({ success: true, type: "CHECK_OUT", data: existing });
    } else {
      return res.json({ success: true, type: "CHECK_OUT", data: existing });
    }
  } catch (error) {
    console.error("Attendance Error:", error);
    return res.status(500).json({ error: "Operation failed" });
  }
};

//Get attendance for employee
export const getAttendance = async (req, res) => {
  const session = req.session;
  const employee = await Employee.findOne({ userId: session.userId });
  if (!employee) return res.Status(404).json({ error: "Employee not found" });

  const limit = parseInt(req.query.limit || 30);
  const history = await Attendance.find({ employeeId: employee._id })
    .sort({ date: -1 })
    .limit(limit);

  return res.json({
    data: history,
    employee: { isDeleted: employee.isDeleted },
  });
  try {
  } catch (error) {
    return res.Status(500).json({ error: "Operation failed attendance" });
  }
};
