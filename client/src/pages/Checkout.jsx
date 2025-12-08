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
    <AppProvider>
      <AppLayout>
        <section className="px-2 md:px-6 lg:px-12 py-8 min-h-screen block mb-6">
          <div className="block max-w-full w-full">
            <div className="flex items-center">
              {/* Back Arrow */}
              <Button onClick={() => navigate("/cart")} className="mr-4">
                <ArrowBackIcon />
              </Button>

              <h2>Payment</h2>
            </div>

            <div className="w-full lg:w-3/4 space-y-4 mt-6">
             {/* Select Payment Method */}

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
