// src/pages/Checkout.jsx

import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import AppFooter from "../components/footer/AppFooter";
import { useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core";
import { useCart } from "../hooks/CartContext";
import useAuthentication from "../hooks/useAuthentication";
import EditAddressDialog from "../components/EditAddressDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { formatCurrency } from "../utils/formatCurrency";
import { SERVER_BASE_URL } from "../utils/api";
import axios from "axios";
import DebitPayment from "../components/DebitPayment";
import BankTransferPayment from "../components/BankTransferPayment";
import PaystackPaymentRedirect from "../components/PaystackPaymentRedirect";

const Checkout = () => {
  const { session } = useAuthentication();
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isOpenShippingAddressModal, setIsOpenShippingAddressModal] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userCountry, setUserCountry] = useState("NG");

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
  }, [session.token]);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setUserCountry(data.country_code || "NG");
      } catch (error) {
        console.error("Error detecting country:", error);
        setUserCountry("NG");
      }
    };

    detectCountry();
  }, []);

  const handlePaystackPayment = () => {
    // Implement paystack payment handling logic here
    setSelectedPaymentMethod("Paystack");
  };

  const handleDebitCardPayment = () => {
    // Implement debit payment handling logic here
    setSelectedPaymentMethod("debit");
  };

  const handleTransferPayment = () => {
    // Implement bank transfer payment handling logic here
    setSelectedPaymentMethod("transfer");
  };

  const handlePaymentSuccess = (data) => {
    try {
      // clear the cart
      if (cartItems.length > 0) {
        cartItems.forEach((item) => removeFromCart(item?.id));
      }
    } catch (error) {
      console.error("Error Failed to clear cart:", error);
      setErrorMessage("Failed to clear cart after payment.");
    }
    // redirect to success page
    navigate("/orders/order-confirmation" + data?.orderId);
  };

  const handleSavedAndSuccess = () => {
    setShippingAddress(session?.user?.shippingAddress);
    setIsOpenShippingAddressModal(false);
  };

  // Calculate cart total
  const sum = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingFee = (sum * 0.2) / 100; // Flat shipping fee
  const tax = (sum * 0.1) / 100; // Flat 5% tax

  // Calculate final amount to pay
  const finalAmount = sum + shippingFee + tax;

  return (
    <AppProvider>
      <AppLayout>
        <section className="px-2 md:px-6 lg:px-12 py-8 min-h-screen block mb-6">
          <div className="block max-w-full w-full">
            <div className="flex items-center mb-6">
              {/* Back Arrow */}
              <Button onClick={() => navigate(-1)} className="mr-4">
                <ArrowBackIcon />
              </Button>

              <h2>Payment</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Side - Payment Methods */}
              <div className="w-full lg:w-2/3 space-y-4">
                {/* Select Payment Method */}

                <div className="mb-6 flex justify-between gap-4">
                  <button
                    onClick={handlePaystackPayment}
                    className="flex w-full items-center justify-center rounded-1gbg-blue-700 px-5 py-2.5  
text-sn font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300dark:bg-blue  
dark:hover:bg-green-700"
                  >
                    Pay with Paystack
                  </button>
                  <button
                    onClick={handleDebitCardPayment}
                    className="flex w-full items-center justify-center rounded-1gbg-blue-700 px-5 py-2.5  
text-sn font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300dark:bg-blue  
dark:hover:bg-green-700"
                  >
                    Pay with Debit Card
                  </button>

                  <button
                    onClick={handleTransferPayment}
                    className="flex w-full items-center justify-center rounded-1gbg-blue-700 px-5 py-2.5
  text-sn font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300dark:bg-blue
  dark:hover:bg-green-700"
                  >
                    Bank Transfer
                  </button>
                </div>

                {/* Debit Card Form */}
                {selectedPaymentMethod === "debit" && <DebitPayment />}

                {/* Paystack Payment Redirection */}
                {selectedPaymentMethod === "Paystack" && (
                  <PaystackPaymentRedirect />
                )}

                {/* Bank Transfer Payment Method */}
                {selectedPaymentMethod === "transfer" && (
                  <BankTransferPayment />
                )}
              </div>

              {/* Right Side - Order Summary */}
              <div className="w-full lg:w-1/3">
                <div className="p-4 border border-gray-300 rounded-lg sticky top-4">
                  <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(sum, userCountry)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping Fee:</span>
                    <span>{formatCurrency(shippingFee, userCountry)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax (%):</span>
                    <span>{formatCurrency(tax, userCountry)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(finalAmount, userCountry)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Edit Shipping Address Modal */}
        {isOpenShippingAddressModal && (
          <EditAddressDialog
            open={isOpenShippingAddressModal}
            onClose={() => setIsOpenShippingAddressModal(false)}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            onSavedAndSuccess={handleSavedAndSuccess}
          />
        )}
      </AppLayout>

      {/* App Footer */}
      <AppFooter />
    </AppProvider>
  );
};

export default Checkout;
