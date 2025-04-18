import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Withdraw from "./pages/Withdraw.jsx";
import Deposit from "./pages/Deposit.jsx";
import BalanceEnquiry from "./pages/BalanceEnquiry.jsx";
import MiniStatement from "./pages/MiniStatement.jsx";
import PinReset from "./pages/PinReset.jsx";
import AccountStatement from "./pages/AccountStatement.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx"; 

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/balance-enquiry" element={<BalanceEnquiry />} />
          <Route path="/mini-statement" element={<MiniStatement />} />
          <Route path="/pin-reset" element={<PinReset />} />
          <Route path="/account-statement" element={<AccountStatement />} />

          {/* Admin Routes */}
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
