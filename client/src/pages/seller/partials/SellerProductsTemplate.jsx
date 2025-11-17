// src/pages/seller/partials/SellerProductsTemplate.jsx

import { useState, useEffect } from "react";
import ProductsTable from "../../../components/products/ProductsTable";
import { SERVER_BASE_URL } from "../../../utils/api";
import axios from "axios";
import useAuthentication from "../../../hooks/useAuthentication";

const SellerProductsTemplate = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { session } = useAuthentication();

  // useEffect to fetch products, axios get request
  useEffect(() => {
    if (!isLoading) {
      getProducts();
    }
  }, []);

  const getProducts = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}products/seller/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch products.");
      setIsLoading(false);
    }
  };

  const showErrorMessage = () => {
    return (
      <div className="text-red-500 text-sm mt-2">
        <h2 className="text-red-500 text-xl md:text-2xl lg:text-4xl font-bold">
          Something went wrong
        </h2>
        <p>{errorMessage}</p>
      </div>
    );
  };

  const showData = () => (
    <>
      <ProductsTable products={products} />
    </>
  );

  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-base lg:text-xl font-bold mb-4">
            Seller Products
          </h1>
        </div>
      </div>
      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-2xl text-gray-500">Loading products...</p>
        </div>
      ) : errorMessage ? (
        showErrorMessage()
      ) : (
        showData()
      )}
    </div>
  );
};

export default SellerProductsTemplate;
