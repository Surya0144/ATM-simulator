import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Transaction from "../models/Transaction.js"; 
import Account from "../models/Account.js";
import bcrypt from "bcryptjs";

import ATM from "../models/ATMStatus.js"; // ⬅️ Create this model if not already

const MAX_DAILY_LIMIT = 25000;

export const withdraw = async (req, res) => {
    
  const { amount } = req.body;
  const numericAmount = Number(amount); // Convert to number
  const userId = req.user.id;

  try {
    const account = await Account.findOne({ userId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Check for ATM funds
    const atm = await ATM.findOne();
    if (!atm || atm.availableCash < numericAmount) {
      return res.status(400).json({ message: "ATM has insufficient funds" });
    }

    // Daily transaction limit logic
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day

    const dailyWithdrawals = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "withdrawal",
          timestamp: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalToday = dailyWithdrawals[0]?.total || 0;

    if (totalToday + numericAmount > MAX_DAILY_LIMIT) {
      return res.status(400).json({
        message: "Daily withdrawal limit exceeded",
        details: {
          dailyLimit: MAX_DAILY_LIMIT,
          amountUsed: totalToday,
          amountRemaining: MAX_DAILY_LIMIT - totalToday,
          requestedAmount: numericAmount
        }
      });
    }

    if (account.balance < numericAmount) {
      console.error("Withdrawal failed - account balance insufficient", {
        comparison: account.balance < numericAmount,
        difference: account.balance - numericAmount
      });
      return res.status(400).json({ 
        message: "Error processing withdrawal. Make sure you have sufficient balance.",
        details: {
          currentBalance: account.balance,
          requestedAmount: numericAmount,
          difference: account.balance - numericAmount
        }
      });
    }

    account.balance -= numericAmount;
    atm.availableCash -= numericAmount;

    // Record transaction
    const transaction = new Transaction({
      userId,
      type: "withdrawal",
      amount: numericAmount,
    });

    // Add to embedded transactions array
    account.transactions.push({
      type: "withdrawal",
      amount: numericAmount,
    });

    // Save all
    await Promise.all([transaction.save(), account.save(), atm.save()]);

    res.status(200).json({
      message: "Withdrawal successful",
      balance: account.balance,
    });
  } catch (error) {
    console.error("Withdrawal Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Deposit money
export const deposit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const account = await Account.findOne({ userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const numericAmount = Number(amount);
    account.balance += numericAmount;
    account.transactions.push({
      type: "deposit",
      amount: numericAmount,
    });

    await account.save();

    const transaction = new Transaction({
      userId,
      type: "deposit",
      amount: numericAmount,
    });

    await transaction.save();

    res.status(200).json({
      message: "Deposit successful",
      balance: account.balance,
    });
  } catch (error) {
    console.error("Deposit Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Balance enquiry
export const balanceEnquiry = async (req, res) => {
  try {
    const userId = req.user.id;

    const account = await Account.findOne({ userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({
      message: "Balance fetched successfully",
      balance: account.balance,
    });
  } catch (error) {
    console.error("Balance Enquiry Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Mini statement
export const miniStatement = async (req, res) => {
  try {
    const userId = req.user.id;

    const account = await Account.findOne({ userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Return last 5 transactions (sorted by timestamp desc)
    const last5 = account.transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    res.status(200).json({ transactions: last5 });
  } catch (err) {
    console.error("Mini Statement Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Account statement
export const accountStatement = async (req, res) => {
  const userId = req.user.id;
  const { type, startDate, endDate, page = 1, limit = 10 } = req.query;

  const query = { userId };
  if (type) query.type = type;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  try {
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ transactions, total });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch account statement" });
  }
};

// PIN reset
export const pinReset = async (req, res) => {
  const { newPin } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new PIN before storing
    const hashedPin = await bcrypt.hash(newPin, 10);
    user.pin = hashedPin;

    await user.save();
    res.status(200).json({ message: "PIN reset successful" });
  } catch (error) {
    console.error("PIN Reset Error:", error.message);
    res.status(500).json({ message: "Server error resetting PIN" });
  }
};
