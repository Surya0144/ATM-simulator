import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "User";
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Swal.fire({
          title: "Logged Out",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <div>
      <div className="dashboard-container">
        <h2>Welcome back, {name}! 👋</h2>
        <div className="dashboard-layout">
          {/* Left Side */}
          <div className="dashboard-left">
            <Link to="/withdraw" className="menu-item">
              Withdraw Cash
            </Link>
            <Link to="/deposit" className="menu-item">
              Deposit Cash
            </Link>
            <Link to="/balance-enquiry" className="menu-item">
              Balance Enquiry
            </Link>
          </div>

          {/* Right Side */}
          <div className="dashboard-right">
            <Link to="/mini-statement" className="menu-item">
              Mini Statement
            </Link>
            <Link to="/account-statement" className="menu-item">
              Account Statement
            </Link>
            <Link to="/pin-reset" className="menu-item">
              Reset PIN
            </Link>
          </div>
        </div>

        {/* Logout Button - Bottom Left */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
