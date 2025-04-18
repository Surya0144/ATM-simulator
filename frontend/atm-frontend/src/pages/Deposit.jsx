import React, { useState } from "react";
import { deposit } from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Deposit.css";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const data = await deposit({ amount });

      Swal.fire({
        icon: "success",
        title: "Deposit Successful!",
        text: `₹${amount} has been added to your account.`,
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate("/dashboard"),
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Error processing deposit.",
      });
    }
  };

  return (
    <div className="container">
      <h2>Deposit Cash</h2>
      <form onSubmit={handleDeposit} className="deposit-form">
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="deposit-input"
        />
        <button type="submit" className="deposit-button">
          Deposit
        </button>
      </form>
    </div>
  );
};

export default Deposit;
