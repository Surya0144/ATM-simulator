import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  cardNumber: { type: String, unique: true },
  pin: String,
  accountNumber: String,
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
