import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";

import {
  withdraw,
  deposit,
  balanceEnquiry,
  miniStatement,
  accountStatement,
  pinReset,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/withdraw", authMiddleware, withdraw); // Withdraw money
router.post("/deposit", authMiddleware, deposit); // Deposit money
router.get("/balance", authMiddleware, balanceEnquiry); // Balance Enquiry
router.get("/mini-statement", authMiddleware, miniStatement); // Mini Statement
router.get("/account-statement", authMiddleware, accountStatement); // Account Statement
router.post("/pin-reset", authMiddleware, pinReset); // PIN Reset
router.get("/audit-logs", authMiddleware, getAuditLogs); // Audit Logs

export default router;
