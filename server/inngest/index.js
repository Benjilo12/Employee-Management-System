import { Inngest, step } from "inngest";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "employee-app" });

// Auto Check-out employees
const autoCheckOut = inngest.createFunction(
  { id: "auto-check-out", event: "empoyee/check-out" },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;
    //Wait for 9 hours
    await step.sleepUntil(
      "wait-for-the-9-hours",
      new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    );

    //get Attendance data
    let attendance = await Attendance.findById(attendanceId);

    if (!attendance?.checkOut) {
      //get Employee data
      const employee = await Employee.findById(employeeId);

      //send reminder email

      //after 10 hours, mark attendance as checked out with status "Late"
      await step.sleepUntil(
        "Wait-for-the-1-hour",
        new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
      );

      attendance = await Attendance.findById(attendanceId);
      if (!attendance?.checkOut) {
        attendance.checkOut =
          new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000;
        attendance.workinhHours = 4;
        attendance.dayType = "Half Day";
        attendance.status = "LATE";
        await attendance.save();
      }
    }
  },
);

//send email to admin, If admin doesn't take action on leave appliaction within 24 hours
const LeaveApplicationReminder = inngest.createFunction(
  {
    id: "leave-application-reminder",
    event: "empoyee/check-out",
  },
  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    //wait for 24 hours
    await step.sleepUntil(
      "wait-for-the-24-hours",
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    );

    const leaveApplication =
      await LeaveApplication.findById(leaveApplicationId);
  },
);

// Create an empty array where we'll export future Inngest functions
export const functions = [autoCheckOut];
