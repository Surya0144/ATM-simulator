import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // if (!authHeader.startsWith("Bearer")) {
  //   return res.status(401).json({ message: "Unauthorized: No token provided" });
  // }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-pin");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

export default authMiddleware;
