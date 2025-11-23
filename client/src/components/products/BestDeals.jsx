// src/components/products/BestDeals.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import GallerySlider from "./GallerySlider";
import useAuthentication from "../../hooks/useAuthentication";
import { SERVER_BASE_URL } from "../../utils/api";
import LoadingSpinnerBody from "../LoadingSpinnerBody";

const BestDeals = () => {
  const { session } = useAuthentication();
  const [bestDeals, setBestDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getBestDeals();
  }, []); // Empty dependency array - runs once on mount

  const getBestDeals = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}products/best-deals`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      setBestDeals(response.data || []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinnerBody />;
  }

  if (errorMessage) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="best-deals-section p-4">
      <h2 className="text-3xl font-bold mb-4">Best Deals {bestDeals.length}</h2>
      {bestDeals.length > 0 ? (
        <GallerySlider products={bestDeals} />
      ) : (
        <p className="text-gray-500">No deals available at the moment.</p>
      )}
    </div>
  );
};

export default BestDeals;
