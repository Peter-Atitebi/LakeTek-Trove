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

  const signIn = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setSession({ token, user });
    navigate("/dashboard");
  };

  // Add this new function to refresh session from localStorage
  const refreshSession = () => {
    try {
      const token = localStorage.getItem("token") || null;
      const user = JSON.parse(localStorage.getItem("user")) || null;
      setSession({ token, user });
    } catch (error) {
      console.error("Failed to refresh session:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const protectedRoutes = [
      "/dashboard",
      "/account",
      "/admin",
      "/seller",
      "/user",
      "/cart",
    ];

    const currentPath = window.location.pathname;
    const isProtectedRoute = protectedRoutes.some((route) =>
      currentPath.startsWith(route)
    );

    if (!token && !user && isProtectedRoute) {
      navigate("/login");
    }
  }, []);

  return { session, signIn, signOut, refreshSession };
};

export default useAuthentication;
