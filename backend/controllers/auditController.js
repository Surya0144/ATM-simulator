import AuditLog from "../models/AuditLog.js";

/**
 * Logs an action performed by a user.
 * @param {String} userId - The ID of the user performing the action.
 * @param {String} action - The action performed (e.g., "Login", "Withdrawal").
 */
export const logAction = async (userId, action) => {
  try {
    await AuditLog.create({ userId, action });
  } catch (error) {
    console.error("Audit Log Error:", error.message);
  }
};

/**
 * Fetch audit logs (Admin Only)
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("userId", "name email")
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching audit logs", error: error.message });
  }
};
