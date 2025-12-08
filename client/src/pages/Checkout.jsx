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

const Checkout = () => {
  const { session } = useAuthentication();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, cartTotalAmount } = useCart();
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
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

  const handlePaystackPayment = () => {
    // Implement paystack payment handling logic here
    setSelectedPaymentMethod("Paystack");
  };

  const handleDebitCardPayment = () => {
    // Implement debit payment handling logic here
    setSelectedPaymentMethod("debit");
  };

  return (
    <AppProvider>
      <AppLayout>
        <section className="px-2 md:px-6 lg:px-12 py-8 min-h-screen block mb-6">
          <div className="block max-w-full w-full">
            <div className="flex items-center">
              {/* Back Arrow */}
              <Button onClick={() => navigate(-1)} className="mr-4">
                <ArrowBackIcon />
              </Button>

              <h2>Payment</h2>
            </div>

            <div className="w-full lg:w-3/4 space-y-4 mt-6">
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
              </div>

              {/* Debit Card Form */}
              {selectedPaymentMethod === "debit" && (
                <>
                  <div className="mb-G grid grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="full_name"
                        className="mb-2 block text-sm font-medium [text-gray-900 dark:text-white"
                      >
                        Full name (as displayed on card)*
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5
text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Bonnie Green"
                        required
                      />
                    </div>
                    {/* Card Number */}
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="card number input"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Card number*
                      </label>
                      <input
                        type="text"
                        id="card-number-input"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5  
text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  
dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="xxxx-xxxx-xxxx-xxxx"
                        required
                      />
                    </div>

                    {/* Expiration */}
                    <div>
                      <label
                        htmlFor="card-expiration-input"
                        className="mb-2 block text-se font-medium text-gray-900 dark:text-white"
                      >
                        Card expiration*
                      </label>
                      <input
                        type="text"
                        id="card-expiration-input"
                        className="block w-full rounded-ig border  
text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  
border-gray-300 bg-gray-50 p-2.5  
dark:border-gray-680 dark:bg-gray-700 dark:text-white"
                        placeholder="12/23"
                        required
                      />
                    </div>

                    {/* CVV */}
                    <div>
                      <label
                        htmlFor="cvv-input"
                        className="mb-2 block text-sn font-medium text-gray-900 dark:text-white"
                      >
                        CVV*
                      </label>
                      <input
                        type="number"
                        id="cvv-input"
                        className="block w-full rounded-1g border border-gray-300 bg-gray-50 p-2.5  
text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  
dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="..."
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 flex w-full items-center justify-center rounded-1gbg-blue-700 px-5 py-2.5
  text-sn font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300dark:bg-blue
  dark:hover:bg-green-700"
                  >
                    Pay Now
                  </button>
                </>
              )}

              {/* Paystack Payment Redirection */}
              {selectedPaymentMethod === "Paystack" && (
                <div className="mt-6">
                  <p>
                    You will be redirected to Paystack to complete your payment.
                  </p>
                  <button
                    onClick={() => {}}
                    className="mt-4 flex w-full items-center justify-center rounded-1gbg-blue-700 px-5 py-2.5  
text-sn font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300dark:bg-blue  
dark:hover:bg-green-700"
                  >
                    Proceed to Paystack
                  </button>
                </div>
              )}

              {/* Cart Total */}
            </div>
          </div>
        </section>
      </AppLayout>

      {/* App Footer */}
      <AppFooter />
    </AppProvider>
  );
};

export default Checkout;
