// src/hooks/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import SuccessMessageModal from "../components/SuccessMessageModal";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cartItems");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modal State
  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Helper function to get product ID (handles both id and _id)
  const getProductId = (item) => {
    return item.id || item._id;
  };

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    // Validate item
    if (!item) {
      console.error("Cannot add null/undefined item to cart");
      return;
    }

    const itemId = getProductId(item);

    if (!itemId) {
      console.error("Product must have an id or _id", item);
      return;
    }

    // Normalize the item to ensure it has both id and _id
    const normalizedItem = {
      ...item,
      id: itemId,
      _id: itemId,
    };

    setCartItems((prev) => {
      const exist = prev.find((i) => getProductId(i) === itemId);

      if (exist) {
        return prev.map((i) =>
          getProductId(i) === itemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prev, { ...normalizedItem, quantity }];
    });

    setSuccessModal({
      open: true,
      message: `${item.name} has been added to your cart!`,
    });
  };

  // Remove single item
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => getProductId(i) !== id));
  };

  // Clear entire cart
  const clearCart = () => setCartItems([]);

  // Total price
  const cartTotalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotalAmount,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}

      {/* Success Modal */}
      <SuccessMessageModal
        open={successModal.open}
        message={successModal.message}
        onClose={() => setSuccessModal({ open: false, message: "" })}
        onContinue={() => setSuccessModal({ open: false, message: "" })}
      />
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
