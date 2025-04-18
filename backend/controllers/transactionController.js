import User from "../models/UserModel.js"; // Assuming UserModel is used for user data
import Transaction from "../models/Transaction.js"; // Assuming Transaction model exists
import Account from "../models/Account.js";
import bcrypt from "bcryptjs"; 

// Withdraw money

export const withdraw = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  try {
    const account = await Account.findOne({ userId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Deduct balance
    account.balance -= amount;

    // Create a transaction
    const transaction = new Transaction({
      userId,
      type: "withdrawal", // ✅ lowercase!
      amount,
    });

    // Also push to embedded array in account
    account.transactions.push({
      type: "withdrawal",
      amount,
    });

    await transaction.save(); // Save transaction to Transaction collection
    await account.save(); // Save updated account

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
    const amount = Number(req.body.amount); // ✅ Ensures numeric operation
    const userId = req.user.id;
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    const account = await Account.findOne({ userId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Update balance
    account.balance += amount;

    // Add to embedded transactions in Account
    account.transactions.push({
      type: "deposit",
      amount: amountNumber,
    });

    await account.save();

    // Save to Transaction collection
    const transaction = new Transaction({
      userId,
      type: "deposit",
      amount: amountNumber,
    });
    await transaction.save();

    res.status(200).json({
      message: "Deposit successful",
      balance: account.balance,
    });
  } catch (err) {
    console.error("Deposit Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Balance enquiry
export const balanceEnquiry = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in req.user

  try {
    const user = await User.findById(userId);
    res.status(200).json({ balance: user.balance });
  } catch (error) {
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
  const userId = req.user.id; // Assuming user ID is available in req.user

  try {
    const user = await User.findById(userId);
    res.status(200).json({ transactions: user.transactions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PIN reset
export const pinReset = async (req, res) => {
  const { newPin } = req.body;
  const userId = req.user.id; // Assuming user ID is available in req.user

  try {
    const user = await User.findById(userId);
    const hashedPin = await (bcrypt.newpin, 10);
    user.pin = hashedPin; // Hash the new PIN before saving
    // user.pinReset = true; // Mark as PIN reset
    await user.save();
    res.status(200).json({ message: "PIN reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
