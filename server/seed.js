import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

/**
 * Temporary password for the admin user
 * This should be changed after first login
 */
const TemporaryPassword = "admin123";

/**
 * Seed script to create an admin user if one doesn't exist
 * This script is run once to initialize the admin account
 */
async function registerAdmin() {
  try {
    // Get admin email from environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (!ADMIN_EMAIL) {
      console.error("Missing ADMIN_EMAIL env variable");
      process.exit(1);
    }

    // Connect to the database
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("User already esist as role", existingAdmin.role);
      process.exit(0);
    }

    // Hash the temporary password for security
    const hashedPassword = await bcrypt.hash(TemporaryPassword, 10);

    // Create the admin user in the database
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    });

    // Log the created admin credentials
    console.log("Admin user created");
    console.log("\nemail:", admin.email);
    console.log("password:", TemporaryPassword);
    console.log("\nchange the password after login");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed", error);
  }
}

// Execute the admin registration function
registerAdmin();
