import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";

export const login = async (req, res) => {
  const { cardNumber, pin } = req.body;

  if (!cardNumber || !pin) {
    return res
      .status(400)
      .json({ message: "Card number and PIN are required" });
  }

  try {
    const user = await User.findOne({ cardNumber });
    if (!user) {
      return res.status(401).json({ message: "Invalid card number or PIN" });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid card number or PIN" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cardNumber: user.cardNumber,
        accountNumber: user.accountNumber,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const register = async (req, res) => {
  const { name, email, pin, cardNumber, accountNumber, isAdmin } = req.body;

  try {
    const existing = await User.findOne({ cardNumber });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const newUser = new User({
      name,
      email,
      pin: hashedPin,
      cardNumber,
      accountNumber,
      isAdmin: isAdmin || false,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
