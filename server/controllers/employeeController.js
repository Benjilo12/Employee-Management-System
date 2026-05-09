import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// Get all employees, optionally filtered by department
// GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;

    // Build filter object — only apply department filter if provided
    const where = {};
    if (department) where.department = department;

    // Fetch employees and attach their linked user's email and role
    const employees = await Employee.find(where)
      .populate("userId", "email role")
      .lean();

    // Sort by newest first and reshape each record for the client
    const result = employees
      .toSorted((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((emp) => ({
        ...emp,
        id: emp._id.toString(),
        user: emp.userId
          ? { email: emp.userId.email, role: emp.userId.role }
          : null,
      }));

    return res.json(result);
  } catch (error) {
    console.error("Get employees error:", error);
    return res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// Create a new employee along with their user account
// POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
    } = req.body;

    // Validate that the minimum required fields are present
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Hash the password before storing it
    const hashed = await bcrypt.hash(password, 10);

    // Create the user account first to get the userId reference
    const user = await User.create({
      email,
      password: hashed,
      role: role || "EMPLOYEE",
    });

    // Create the employee record linked to the user account
    // If employee creation fails, roll back by deleting the user
    try {
      const employee = await Employee.create({
        userId: user._id,
        firstName,
        lastName,
        email,
        phone,
        position,
        department: department || "Engineering",
        basicSalary: Number(basicSalary) || 0,
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,
        joinDate: new Date(joinDate),
        bio: bio || "",
      });
      return res.status(201).json({ success: true, employee });
    } catch (err) {
      // Rollback: remove the user if employee creation fails
      await User.findByIdAndDelete(user._id);
      throw err;
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("Create employee error:", error);
    return res.status(500).json({ error: "Failed to create employee" });
  }
};

// Update an existing employee's details and their linked user account
// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
      employmentStatus,
    } = req.body;

    // Update the employee record and get the updated document
    // Returns null if no employee with the given id exists
    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        phone,
        position,
        department: department || "Engineering",
        basicSalary: Number(basicSalary) || 0,
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,
        joinDate: new Date(joinDate),
        employmentStatus: employmentStatus || "ACTIVE",
        bio: bio || "",
      },
      { new: true },
    );

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // Build the user update payload — only include password and role if provided
    const userUpdate = { email };
    if (role) userUpdate.role = role;
    if (password) userUpdate.password = await bcrypt.hash(password, 10);

    // Update the linked user account
    await User.findByIdAndUpdate(employee.userId, userUpdate);

    return res.json({ success: true });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("Update employee error:", error);
    return res.status(500).json({ error: "Failed to update employee" });
  }
};

// Soft delete an employee by marking them as deleted and inactive
// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // Soft delete — preserve the record but flag it as deleted and inactive
    employee.isDeleted = true;
    employee.employmentStatus = "INACTIVE";
    await employee.save();

    return res.json({ success: true });
  } catch (error) {
    console.error("Delete employee error:", error);
    return res.status(500).json({ error: "Failed to delete employee" });
  }
};
