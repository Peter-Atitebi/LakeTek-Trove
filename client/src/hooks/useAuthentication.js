// src/hooks/useAuthentication.js

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuthentication = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => {
    try {
      const token = localStorage.getItem("token") || null;
      const user = JSON.parse(localStorage.getItem("user")) || null;
      return { token, user };
    } catch (error) {
      console.error("Failed to get session:", error);
      return { token: null, user: null };
    }
  });

  // Sign out function
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSession({ token: null, user: null });
    navigate("/login");
  };

  // Fix: Renamed to match the return order and made it consistent
  const signIn = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setSession({ token, user });
    // Navigate to dashboard after successful sign in
    navigate("/dashboard");
  };

  // Fix: Removed problematic useEffect that was causing infinite redirects
  // This effect was running every time session changed and redirecting to login
  // which would clear the session and cause an infinite loop

  // Only redirect to login if there's no session on initial load
useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Define routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/account",
    "/admin",
    "/seller",
    "/user",
    "/cart", // if cart requires auth
  ];

  const currentPath = window.location.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  // Only redirect if on a protected route and not authenticated
  if (!token && !user && isProtectedRoute) {
    navigate("/login");
  }
}, []);

  // Fix: Return object instead of array for better destructuring
  return { session, signIn, signOut };
};

export default useAuthentication;
