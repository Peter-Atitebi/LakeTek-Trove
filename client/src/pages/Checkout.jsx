// src/pages/Checkout.jsx

import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import AppFooter from "../components/footer/AppFooter";
import { useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core";
import { useCart } from "../hooks/CartContext";
import { useAuthentication } from "../hooks/useAuthentication";

const Checkout = () => {
  const { session } = useAuthentication();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, cartTotalAmount } = useCart();
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("creditCard");
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isOpenShippingAddressModal, setIsOpenShippingAddressModal] =
    useState(false);

  // check session and redirect to login if not authenticated
  useEffect(() => {
    if (!session || !session.token) {
      navigate("/login");
    }
    // check if user has shipping address
    if (!shippingAddress) {
      setIsOpenShippingAddressModal(true);
    } else {
      setIsOpenShippingAddressModal(false);
      setShippingAddress(session?.user?.shippingAddress);
    }
  }, [session.token, shippingAddress, navigate]);

  return (
    <div>
      <h1>Checkout Page</h1>
      <p>Welcome to the Checkout Page.</p>
    </div>
  );
};

export default Checkout;
