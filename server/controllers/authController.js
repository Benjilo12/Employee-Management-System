import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login for employee and admin
// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password, role_type } = req.body;

    // Ensure both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if a user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Ensure the user has the correct role for the login portal they're using
    if (role_type === "admin" && user.role !== "ADMIN") {
      return res.status(401).json({ error: "Not authorized as admin" });
    }

    if (role_type === "employee" && user.role !== "EMPLOYEE") {
      return res.status(401).json({ error: "Not authorized as employee" });
    }

    // Verify the provided password against the stored hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Build the JWT payload with essential user info
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    // Sign the token with a 7-day expiry
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ user: payload, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

// Get the current authenticated user's session data
// GET /api/auth/session
export const session = (req, res) => {
  // req.session is attached by the auth middleware after verifying the JWT
  const session = req.session;
  return res.json({ user: session });
};

// Change password for the currently authenticated user
// POST /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    // Get the authenticated user's session from the auth middleware
    const session = req.session;
    const { currentPassword, newPassword } = req.body;

    // Ensure both passwords are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both passwords are required" });
    }

    // Look up the user by their session ID
    const user = await User.findById(session.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify the current password before allowing a change
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid)
      return res.status(400).json({ error: "Current password is incorrect" });

    // Hash the new password and save it
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(session.userId, { password: hashed });

    return res.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ error: "Failed to change password" });
  }
};
