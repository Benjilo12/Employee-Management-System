//Get dashboard for employee and admin
export const getDashboard = async (req, res) => {
  try {
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ error: "failed" });
  }
};
