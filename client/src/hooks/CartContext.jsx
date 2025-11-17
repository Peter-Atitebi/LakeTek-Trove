// src/hooks/CartContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  // initialize cart state
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // add item to cart
  const addToCart = (item, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [...prevItems, { ...item, quantity }];
      }
    });
    // show success message
    setShowSuccess(true);
    setShowSuccessMessage(`${item.name} has been added to cart!`);
  };

  // remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // clear cart items
  const clearCart = () => {
    setCartItems([]);
  };

  // calculate total amount
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
      {showSuccess && (
        <div className="success-message">{showSuccessMessage}</div>
      )}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
