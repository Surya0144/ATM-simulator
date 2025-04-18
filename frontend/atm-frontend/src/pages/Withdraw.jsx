import React, { useState } from "react";
import { withdraw } from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Withdraw.css";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await withdraw({ amount }, token);

      Swal.fire({
        icon: "success",
        title: "Withdrawal Successful!",
        text: `₹${amount} has been withdrawn from your account.`,
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate("/dashboard"),
      });
    } catch (err) {
      console.error("Withdrawal error:", err);
      const errorMessage = err.response?.data?.message || 
                         "Error processing withdrawal. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Withdrawal Failed",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="container">
      <h2>Withdraw Cash</h2>
      <form onSubmit={handleWithdraw} className="withdraw-form">
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="withdraw-input"
        />
        <button type="submit" className="withdraw-button">
          Withdraw
        </button>
      </form>
    </div>
  );
};

export default Withdraw;
