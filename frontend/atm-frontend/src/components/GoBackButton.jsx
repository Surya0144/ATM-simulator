// src/components/GoBackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GoBackButton.css"; // optional styling

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="go-back-btn" onClick={() => navigate(-1)}>
      ← Go Back
    </button>
  );
};

export default GoBackButton;
