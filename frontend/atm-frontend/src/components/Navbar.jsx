import React from 'react';
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">ATM Simulation</div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/withdraw">Withdraw</Link>
        <Link to="/deposit">Deposit</Link>
        <Link to="/balance-enquiry">Balance</Link>
        <Link to="/mini-statement">Mini Statement</Link>
        <Link to="/account-statement">Statement</Link>
        <Link to="/pin-reset">Reset PIN</Link>
      </div>
    </nav>
  );
};

export default Navbar;
