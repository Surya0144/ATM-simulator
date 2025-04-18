import { Link } from "react-router-dom";
// import "..styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/withdraw">Withdraw</Link>
      <Link to="/deposit">Deposit</Link>
      <Link to="/balance-enquiry">Balance Enquiry</Link>
      <Link to="/mini-statement">Mini Statement</Link>
      <Link to="/account-statement">Account Statement</Link>
      <Link to="/pin-reset">Reset PIN</Link>
    </nav>
  );
};

export default Navbar;
