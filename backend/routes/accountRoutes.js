import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import {
  balanceEnquiry,
  withdraw,
  deposit,
  miniStatement,
  accountStatement,
  pinReset,
} from "../controllers/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/balance", authMiddleware, balanceEnquiry);
router.post("/withdraw", authMiddleware, withdraw);
router.post("/deposit", authMiddleware, deposit);
router.get("/mini-statement", authMiddleware, miniStatement);
router.get("/account-statement", authMiddleware, accountStatement);
router.post("/pin-reset", authMiddleware, pinReset);
router.get("/audit-logs", authMiddleware, getAuditLogs);
export default router;
