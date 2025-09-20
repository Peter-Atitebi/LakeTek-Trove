//src/pages/StoreTemplate.jsx

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_BASE_URL } from "../utils/api";

const StoreTemplate = () => {
  const { storeId } = useParams();
  const [productId, setProductId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState({});

  // use effect to get product Id
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get("productId");
    setProductId(prodId);
    if (prodId) {
      getProduct(prodId);
    }
  }, []);

  const getProduct = async (productId) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}products/${productId}`
      );
      if (response.status === 200) {
        if (!response.data) {
          setErrorMessage("Product not found.");
          setIsLoading(false);
          return;
        }
        setProduct(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(`Error fetching product: ${error.message}`);
      console.error("Error fetching product:", error);
    }
  };

  return <div>Store Template Page</div>;
};

export default StoreTemplate;
