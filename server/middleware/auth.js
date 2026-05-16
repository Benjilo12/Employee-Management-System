import jwt from "jsonwebtoken";

// Middleware to protect routes — verifies the JWT token from the Authorization header
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Ensure the Authorization header exists and follows the "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Extract the token from the header (split on space, take the second part)
    const token = authHeader.split(" ")[1];

    // Verify the token against the secret — throws if expired or tampered
    const session = jwt.verify(token, process.env.JWT_SECRET);

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach the decoded session payload to the request for downstream use
    req.session = session;
    if (typeof next === "function") next();
  } catch (error) {
    // Catches expired, malformed, or invalid tokens from jwt.verify
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// Middleware to restrict access to admin users only
// Must be used after protect, since it depends on req.session being set
export const protectAdmin = (req, res, next) => {
  if (req?.session?.role !== "ADMIN") {
    return res.status(401).json({ error: "Admin access required" });
  }
  next();
};
