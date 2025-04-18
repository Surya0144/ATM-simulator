import React, { useEffect } from "react";
import { fetchBalance } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Balance = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getBalance = async () => {
      try {
        const data = await fetchBalance();

        Swal.fire({
          title: "Your Current Balance",
          text: `₹${data.balance}`,
          icon: "info",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/dashboard"); // 👈 Redirect after OK
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch balance.",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/dashboard"); // 👈 Redirect even on error
        });
      }
    };

    getBalance();
  }, [navigate]);

  return <div></div>; // Optional: loading spinner can be shown here
};

export default Balance;
