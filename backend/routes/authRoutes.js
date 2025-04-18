import express from "express";
import { login, register } from "../controllers/authController.js";
import { refillATM, getATMStatus } from "../controllers/adminController.js";
import authMiddleware, { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", login); // Unified login for both admin and users
router.post("/register", register); // Optional

// Admin routes
router.post("/refill-atm", authMiddleware, isAdmin, refillATM);
router.get("/atm-status", authMiddleware, isAdmin, getATMStatus);

export default router;
