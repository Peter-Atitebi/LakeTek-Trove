// src/components/products/BestDeals.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import GallerySlider from "./GallerySlider";
import useAuthentication from "../../hooks/useAuthentication";
import { SERVER_BASE_URL } from "../../utils/api";
import LoadingSpinnerBody from "../LoadingSpinnerBody";
import CategoriesList from "../../hooks/CategoriesList";
import categories from "../../hooks/CategoriesList";
import { Link } from "react-router-dom";

const BestDeals = () => {
  const { session } = useAuthentication();
  const [bestDeals, setBestDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getBestDeals();
  }, []);

  const getBestDeals = async () => {
    // Prevent unnecessary request
    if (!session?.token) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.get(`${SERVER_BASE_URL}products/best-deals`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      // Support both formats: {data: [...]} or [...]
      setBestDeals(res.data?.data || res.data || []);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinnerBody />;

  if (errorMessage) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error: {errorMessage}</p>
        <button
          onClick={getBestDeals}
          className="mt-3 px-4 py-2 bg-black text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="best-deals-section p-4 flex items-star">
      {/* Left Side */}
      <div className="w-1/4">
        <h2 className="text-3xl font-bold mb-4">
          Best Deals 20% Off: {bestDeals.length}
        </h2>

        <hr />

        {/* Category List */}
        <div className="mt-4">
          {categories.map((category, index) => (
            <div key={index} className="mb-3">
              <Link to={`/categories/${category.id}`}>{category.name}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="w-full">
        {bestDeals.length > 0 ? (
          <GallerySlider products={bestDeals} isOpenCategory={true} />
        ) : (
          <p className="text-gray-500">No deals available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default BestDeals;
