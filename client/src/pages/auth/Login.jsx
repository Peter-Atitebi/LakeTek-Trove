//src/pages/auth/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppProvider } from "@toolpad/core";
import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../features/auth/authSlice";
import { SERVER_BASE_URL } from "../../utils/api";

const SignIn = async (formData) => {
  const email = formData.email;
  const password = formData.password;

  const url = `${SERVER_BASE_URL}/auth/login`;
  console.log(url);

  try {
    const res = await axios.post(url, { email, password });
    return res;
  } catch (error) {
    console.log("Error:", error);

    throw new Error("Login failed");
  }
};

const Login = () => {
  const dispatch = useDispatch(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formDate = new FormData(event.target);
    const email = formDate.get("email");
    const password = formDate.get("password");

    dispatch(loginStart());
    try {
      const res = await axios.post(`${SERVER_BASE_URL}/auth/login`, {
        email,
        password,
      });
      if (res.status === 200 || res.status === 201) {
        const user = res.data.user;
        const token = res.data.token;
        if (user && token) {
          dispatch(loginSuccess({ user, token }));

          // store user details and token in local storage
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);

          console.log("Login successful:", res.data);

          // handle role-based navigation
          if (user.role === "admin" || user.role === "manager") {
            navigate(`/admin/dashboard/${user.id}`);
          } else if (user.role === "seller") {
            navigate(`/seller/dashboard/${user.id}`);
          } else {
            navigate(`/user/dashboard/${user.id}`);
          }
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
      dispatch(loginFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: 2,
        }}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/circlelttlogo.png"
            alt="LakeTek Trove Logo"
            className="size-16 lg:size-26"
          />
        </div>

        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {errorMessage && (
          <Typography color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSignIn}
          sx={{ maxWidth: 400, width: "100%" }}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>
        {/* Links to Sign Up and Reset Password pages */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "blue" }}
          >
            Sign Up
          </Link>
          {" | "}
          <Link to="/forgot-password">Reset Password</Link>
        </Typography>
      </Box>
    </AppProvider>
  );
};

export default Login;
