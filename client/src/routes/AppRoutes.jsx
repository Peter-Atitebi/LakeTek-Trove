//src/pages/routes/AppRoutes.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admins/AdminDashboard";
import SellerDashboard from "../pages/seller/SellerDashboard";
import PublicUserDashboard from "../pages/customer/PublicUserDashboard";
import Checkout from "../pages/Checkout";
import PrivateRoutes from "./PrivateRoutes";
import Unauthorized from "../pages/UnAuthorized";
import CartTemplate from "../pages/CartTemplate";
import StoreTemplate from "../pages/StoreTemplate";
import CategoryPage from "../components/products/CategoryPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Cart */}
        <Route path="/cart" element={<CartTemplate />} />

        {/* Products */}
        <Route path="/products" element={<p>Products</p>} />
        <Route path="/store/:storeId" element={<StoreTemplate />} />
        <Route path="/category/:category" element={<CategoryPage />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        <Route
          path="/admin/dashboard/:id"
          element={
            <PrivateRoutes allowedRoles={["admin", "manager"]}>
              <AdminDashboard />
            </PrivateRoutes>
          }
        />
        <Route
          path="/seller/dashboard/:id"
          element={
            <PrivateRoutes allowedRoles={["seller"]}>
              <SellerDashboard />
            </PrivateRoutes>
          }
        />
        <Route
          path="/user/dashboard/:id"
          element={
            <PrivateRoutes allowedRoles={["user", "buyer"]}>
              <PublicUserDashboard />
            </PrivateRoutes>
          }
        />

        {/* checkout */}
        <Route
          path="/checkout"
          element={
            <PrivateRoutes>
              <Checkout />
            </PrivateRoutes>
          }
        />
      </Routes>
    </Router>
  );
};

// export
export default AppRoutes;
