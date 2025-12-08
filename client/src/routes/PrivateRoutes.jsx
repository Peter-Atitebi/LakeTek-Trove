// src/routes/PrivateRoutes.jsx

import { useLocation, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoutes = ({ children, allowedRoles, isCheckout = false }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // get current route location
  const location = useLocation();

  // check if the token exists
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // check if user is allowed to access the route
  if (user?.id && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Special handling for checkout route - allow access without redirect
  if (isCheckout) {
    return children;
  }

  const rolePaths = {
    admin: `/admin/dashboard/${user.id}`,
    manager: `/admin/dashboard/${user.id}`,
    seller: `/seller/dashboard/${user.id}`,
    user: `/user/dashboard/${user.id}`,
    buyer: `/user/dashboard/${user.id}`,
  };

  const targetPath = rolePaths[user?.role];

  if (location.pathname !== targetPath) {
    return <Navigate to={targetPath} replace />;
  }

  return children;
};

PrivateRoutes.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  isCheckout: PropTypes.bool,
};

export default PrivateRoutes;
