//src/pages/auth/Register.jsx

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
import { SERVER_BASE_URL } from "../../utils/api";

// authSlice
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../features/auth/authSlice";

// handle request

const SignUp = async (formElement) => {
  const formData = new FormData(formElement);
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const storeName = formData.get("storeName");
  const description = formData.get("description");
  const code = formData.get("code");

  const url =
    role && role === "manager"
      ? `${SERVER_BASE_URL}/manager/register`
      : `${SERVER_BASE_URL}/auth/register`;

  const data = {
    name,
    email,
    password,
    role,
    storeName,
    description,
    code,
  };

  try {
    const res = await axios.post(url, data);
    console.log("Registration response:", res);
    return res;
  } catch (error) {
    console.log("Backend error details:", error.response?.data);
    console.log("Status code:", error.response?.status);

    // Throw the actual backend error message
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    throw new Error(errorMessage);
  }
};

const Register = () => {
  const dispatch = useDispatch(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // At the top of your component, check the URL
  const urlParams = new URLSearchParams(window.location.search);
  const allowManager = urlParams.get("type") === "manager";
  // register?type=manager (allows manager option in role dropdown)

  // Set initial role based on URL parameter
  const [role, setRole] = useState(allowManager ? "manager" : "buyer");

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    dispatch(registerStart());

    try {
      const res = await SignUp(event.target);

      // Check if registration was actually successful
      if (res.status === 200 || res.status === 201) {
        dispatch(registerSuccess(res.data));
        navigate("/login");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.log("Full error:", error); // Add this for debugging
      dispatch(registerFailure(error?.message || "Registration failed"));
      console.log("Received role:", `"${role}"`); // Shows quotes to catch whitespace
      console.log("Role length:", role.length);
      setErrorMessage(error.message);
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
          Register
        </Typography>

        {errorMessage && (
          <Typography color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSignUp}
          sx={{ maxWidth: 400, width: "100%" }}
        >
          <TextField
            label="Name"
            name="name"
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          {role === "manager" && ( // Show this field only if "Manager is selected
            <TextField
              label="Verification Code"
              name="code"
              type="text"
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />
          )}
          <TextField
            label="Role"
            name="role"
            select
            fullWidth
            required
            margin="normal"
            variant="outlined"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            slotProps={{
              select: {
                native: true,
              },
            }}
          >
            {allowManager ? (
              // Only show manager option
              <option value="manager">Manager</option>
            ) : (
              // Show buyer/seller options
              <>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </>
            )}
          </TextField>

          {role === "seller" && ( // Fields for seller only
            <>
              <TextField
                label="Store Name"
                name="storeName"
                fullWidth
                required
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="Description"
                name="description"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </>
          )}

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
            sx={{ my: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
            Log In
          </Link>
        </Typography>
      </Box>
    </AppProvider>
  );
};

export default Register;
