// src/pages/CartTemplate.jsx

import AppLayout from "../components/AppLayout";
import AppFooter from "../components/footer/AppFooter";

const CartTemplate = () => {
  return (
    <>
      <AppLayout>
        <div>
          <h1>Shopping Cart</h1>
          <p>Your cart is currently empty.</p>
        </div>
      </AppLayout>
    
    {/* Footer */}
    <AppFooter />
    </>
  );
};

export default CartTemplate;
