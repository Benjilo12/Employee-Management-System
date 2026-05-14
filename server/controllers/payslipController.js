import Employee from "../models/Employee.js";
import Payslip from "../models/PaySlip.js";

/**
 * Create a new payslip record
 * Calculates net salary from basic salary, allowances, and deductions
 * POST /api/payslips
 */
export const createPayslip = async (req, res) => {
  try {
    // Extract payslip details from request body
    const { employeeId, month, year, basicSalary, allowances, deductions } =
      req.body;

    // Validate that required fields are provided
    if (!employeeId || !month || !year || !basicSalary) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Calculate net salary: basic + allowances - deductions
    // Treat missing allowances/deductions as 0
    const netSalary =
      Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

    // Create payslip record with calculated net salary
    const payslip = await Payslip.create({
      employeeId,
      month: Number(month),
      year: Number(year),
      basicSalary: Number(basicSalary),
      allowances: Number(allowances || 0),
      netSalary,
    });

    return res.json({ success: true, data: payslip });
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};

/**
 * Retrieve payslips based on user role
 * Admin: Can view all payslips for all employees
 * Employee: Can only view their own payslips
 * GET /api/payslips
 */
export const getPayslip = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";

    if (isAdmin) {
      // Admin: Retrieve all payslips with employee details
      const payslips = await Payslip.find()
        .populate("employeeId")
        .sort({ createdAt: -1 });

      // Format payslips with string IDs for frontend compatibility
      const data = payslips.map((p) => {
        const obj = p.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          Employee: obj.employeeId,
          employeeId: obj.employeeId?.id?.toString(),
        };
      });
      return res.json({ data });
    } else {
      // Employee: Retrieve only their own payslips
      const employee = await Employee.findOne({ userId: session.userId });
      if (!employee) return res.status(404).json({ error: "Not found" });

      // Fetch payslips for this employee, sorted by creation date
      const payslips = await Payslip.find({ employeeId: employee._id }).sort({
        created: -1,
      });
      return res.json({ data: payslips });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};

/**
 * Retrieve a specific payslip by ID
 * Returns payslip with populated employee details
 * GET /api/payslips/:id
 */
export const getPayslipById = async (req, res) => {
  try {
    // Find payslip by ID and populate employee information
    const payslip = await Payslip.findById(req.params.id)
      .populate("employeeId")
      .lean();

    // Return error if payslip not found
    if (!payslip) return res.status(404).json({ error: "Not found" });

    // Format response with string ID for frontend compatibility
    const result = {
      ...payslip,
      id: payslip._id.toString(),
      employee: payslip.employeeId,
    };
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};
