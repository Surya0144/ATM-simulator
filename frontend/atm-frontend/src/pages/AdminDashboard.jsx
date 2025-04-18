import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { getATMStatus, refillATM } from "../services/api";
import Swal from "sweetalert2";



const AdminDashboard = () => {
  const [cashAvailable, setCashAvailable] = useState(null); // initially null for loading
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
            navigate("/" ,{ replace: true });
          });
        }
      });
    };

  const fetchStatus = async () => {
    try {
      const data = await getATMStatus();
      console.log("ATM Status Response:", data);

      if (typeof data.availableCash === "number") {
        setCashAvailable(data.availableCash);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching ATM status:", err);
      setError("Failed to fetch ATM status");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRefill = async () => {
    try {
      const amt = parseInt(amount);
      if (!amt || amt <= 0) return setError("Enter a valid amount");

      const data = await refillATM({ amount: amt });
      setMessage(data.message);
      setError("");
      setAmount("");
      fetchStatus(); // Refresh ATM status
    } catch (err) {
      console.error("Refill error:", err);
      setError(err.response?.data?.message || "Refill failed");
      setMessage("");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 24,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          Logout
        </Button>
      </Box>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          width: "100%",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1) !important",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            color: "#115293",
            fontWeight: 700,
            mb: 3,
          }}
        >
          Admin Dashboard
        </Typography>

        <Box
          sx={{
            bgcolor: "rgba(25, 118, 210, 0.05)",
            borderRadius: 3,
            p: 3,
            mb: 3,
            borderLeft: "5px solid #1976d2",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            💰 ATM Cash Available:
          </Typography>
          <Typography
            variant="h5"
            color="primary"
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            {cashAvailable === null ? (
              <CircularProgress size={24} />
            ) : (
              `₹${cashAvailable.toLocaleString()}`
            )}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Refill Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
              },
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleRefill}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "0 4px 6px rgba(25, 118, 210, 0.25)",
            "&:hover": {
              boxShadow: "0 6px 10px rgba(25, 118, 210, 0.3)",
            },
          }}
        >
          Refill ATM
        </Button>

        {message && (
          <Alert
            severity="success"
            sx={{
              mt: 3,
              borderRadius: 2,
            }}
          >
            {message}
          </Alert>
        )}
        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
