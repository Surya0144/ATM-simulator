import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./models/UserModel.js";
import Account from "./models/Account.js";
import Transaction from "./models/Transaction.js";
import AuditLog from "./models/AuditLog.js";
import ATM from "./models/ATMStatus.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const generateAccountNumber = () =>
  `ACC${Math.floor(100000 + Math.random() * 900000)}`;

const seedData = async () => {
  try {
    // Clear old data
    await Promise.all([
      User.deleteMany(),
      Account.deleteMany(),
      Transaction.deleteMany(),
      AuditLog.deleteMany(),
      ATM.deleteMany(),
    ]);
    console.log("🧹 Old data cleared");

    // Create users (including admin)
    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        pin: await bcrypt.hash("1234", 10),
        cardNumber: "1111222233334444",
        accountNumber: generateAccountNumber(),
        isAdmin: false,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        pin: await bcrypt.hash("5678", 10),
        cardNumber: "5555666677778888",
        accountNumber: generateAccountNumber(),
        isAdmin: false,
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        pin: await bcrypt.hash("0000", 10),
        cardNumber: "9999888877776666",
        accountNumber: generateAccountNumber(),
        isAdmin: true,
      },
    ]);
    console.log("👥 Users seeded");

    // Create accounts for regular users
    const accounts = await Account.insertMany([
      {
        userId: users[0]._id,
        accountNumber: users[0].accountNumber,
        balance: 5000,
        transactions: [],
      },
      {
        userId: users[1]._id,
        accountNumber: users[1].accountNumber,
        balance: 10000,
        transactions: [],
      },
    ]);
    console.log("💳 Accounts seeded");

    // Create transactions
    await Transaction.insertMany([
      {
        userId: users[0]._id,
        account: accounts[0]._id,
        type: "deposit",
        amount: 2000,
        timestamp: new Date(),
      },
      {
        userId: users[0]._id,
        account: accounts[0]._id,
        type: "withdrawal",
        amount: 500,
        timestamp: new Date(),
      },
      {
        userId: users[1]._id,
        account: accounts[1]._id,
        type: "deposit",
        amount: 3000,
        timestamp: new Date(),
      },
    ]);
    console.log("📄 Transactions seeded");

    // Add ATM cash
    await ATM.create({ availableCash: 100000 });
    console.log("🏧 ATM initialized with ₹100000");

    console.log("✅ All data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(seedData);
