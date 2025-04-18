import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true, default: 0 },
  transactions: [
    {
      type: { type: String, enum: ["deposit", "withdrawal"], required: true },
      amount: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  dailyWithdrawn: {
    type: Number,
    default: 0,
  },
  lastTransactionDate: {
    type: Date,
    default: null,
  },
});

const Account = mongoose.model("Account", accountSchema);
export default Account;
