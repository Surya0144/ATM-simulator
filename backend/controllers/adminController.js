import ATM from "../models/ATMStatus.js";

export const getATMStatus = async (req, res) => {
  try {
    const atm = await ATM.findOne(); // Only one ATM document should exist
    if (!atm) {
      return res.status(404).json({ message: "ATM status not found" });
    }
    res.json(atm);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ATM status" });
  }
};

export const refillATM = async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid refill amount" });
  }

  try {
    let atm = await ATM.findOne();
    if (!atm) {
      atm = new ATM({ availableCash: amount });
    } else {
      atm.availableCash += amount;
    }
    await atm.save();
    res.json({
      message: "ATM cash refilled successfully",
      availableCash: atm.availableCash,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to refill ATM" });
  }
};
