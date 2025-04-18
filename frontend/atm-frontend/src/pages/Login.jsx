import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  Avatar,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { login } from "../services/api";

// Custom theme
const atmTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#4791db",
      dark: "#115293",
      contrastText: "#fff",
    },
    secondary: {
      main: "#388e3c",
      light: "#5eae60",
      dark: "#276128",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
          },
        },
      },
    },
  },
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      if (response.user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <ThemeProvider theme={atmTheme}>
      <Container
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            width: "100%",
            boxShadow: "0 8px 40px -12px rgba(0,0,0,0.2)",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "primary.main",
              width: 56,
              height: 56,
            }}
          >
            <AccountBalanceIcon fontSize="large" />
          </Avatar>

          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 3,
            }}
          >
            ATM Login
          </Typography>

          {errorMessage && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                width: "100%",
                borderRadius: 1,
              }}
            >
              {errorMessage}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            style={{ width: "100%" }}
          >
            <TextField
              fullWidth
              label="Card Number"
              variant="outlined"
              margin="normal"
              {...register("cardNumber", {
                required: "Card Number is required",
              })}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber?.message}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 1.5 },
              }}
            />

            <TextField
              fullWidth
              label="PIN"
              variant="outlined"
              type="password"
              margin="normal"
              {...register("pin", { required: "PIN is required" })}
              error={!!errors.pin}
              helperText={errors.pin?.message}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: 1.5 },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 1,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: 1.5,
                boxShadow: "0 4px 6px rgba(25, 118, 210, 0.25)",
                "&:hover": {
                  boxShadow: "0 6px 10px rgba(25, 118, 210, 0.3)",
                },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
