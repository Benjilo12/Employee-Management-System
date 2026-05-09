import Employee from "../models/Employee.js";

// Get the profile of the currently authenticated user
// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const session = req.session;

    // Look up the employee record linked to the authenticated user
    const employee = await Employee.findOne({ userId: session.userId });

    // If no employee record exists, the user is likely an admin
    // Return a minimal profile using their session data
    if (!employee) {
      return res.json({
        firstName: "Admin",
        lastName: "",
        email: session.email,
      });
    }

    return res.json(employee);
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update the bio of the currently authenticated employee
// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const session = req.session;

    // Find the employee record linked to the authenticated user
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // Prevent soft-deleted (deactivated) employees from updating their profile
    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot update your profile.",
      });
    }

    // Only the bio field is updatable from this endpoint
    await Employee.findByIdAndUpdate(employee._id, {
      bio: req.body.bio,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};
