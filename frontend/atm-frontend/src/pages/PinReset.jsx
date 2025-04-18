import React, { useState } from "react";
import { resetPin } from "../services/api";
import "../styles/PinReset.css";
import GoBackButton from "../components/GoBackButton";

const PinReset = () => {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPin({ oldPin, newPin });
      setMessage(data.message);
    } catch (err) {
      setMessage("Error resetting PIN.");
    }
  };

  return (
    <div className="container">
      <GoBackButton />
      <h2>Reset PIN</h2>
      <form onSubmit={handleReset} className="pin-reset-form">
        <input
          type="password"
          placeholder="Old PIN"
          value={oldPin}
          onChange={(e) => setOldPin(e.target.value)}
          required
          className="pin-reset-input"
        />
        <input
          type="password"
          placeholder="New PIN"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
          required
          className="pin-reset-input"
        />
        <button type="submit" className="pin-reset-button">
          Reset PIN
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PinReset;
