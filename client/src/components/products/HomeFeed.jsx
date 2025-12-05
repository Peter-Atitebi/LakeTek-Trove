// src/components/products/HomeFeed.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_BASE_URL } from "../../utils/api";
import useAuthentication from "../../hooks/useAuthentication";
import LoadingSpinnerBody from "../LoadingSpinnerBody";
import { Link } from "react-router-dom";
import PLACEHOLDER_IMAGE from "../../utils/api";
import ProductRating from "../../components/products/ProductRating";

const HomeFeed = () => {
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { session } = useAuthentication();

  const loadFeed = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(`${SERVER_BASE_URL}/products/home-feed`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      });
      setFeed(response.data || []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const renderFeed = () => {
    if (!feed.length) {
      return (
        <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
            No Products Available
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Please check back later for new products.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6 sm:space-y-8 lg:space-y-12 p-2 sm:p-4 lg:p-6">
        {feed.map((group, groupIndex) => (
          <div
            key={`${group.category}-${groupIndex}`}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8"
          >
            {/* Category Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {group.category}
              </h2>
              <Link
                to={`/category/${encodeURIComponent(group.category)}`}
                className="text-purple-600 hover:text-pink-600 font-semibold text-xs sm:text-sm flex items-center gap-1 transition-colors duration-200 flex-shrink-0"
                target="_blank"
              >
                <span className="hidden xs:inline">See All</span>
                <span className="xs:hidden">All</span>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Products Grid - Fully Responsive */}
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {group.products.map((product, productIndex) => {
                const hasDiscount =
                  product.priceBefore && product.priceBefore > product.price;

                const discountPercentage = hasDiscount
                  ? Math.round(
                      ((product.priceBefore - product.price) /
                        product.priceBefore) *
                        100
                    )
                  : 0;

                return (
                  <Link
                    key={product._id || product.id || `product-${productIndex}`}
                    to={`/store/${product.storeId}?productId=${product.id}`}
                    className="block group"
                    target="_blank"
                  >
                    <div className="relative bg-white border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Discount Badge */}
                      {hasDiscount && (
                        <span className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full z-10 shadow-md">
                          -{discountPercentage}%
                        </span>
                      )}

                      {/* Image Container */}
                      <div className="relative overflow-hidden bg-gray-50 aspect-square">
                        <img
                          src={product.image || PLACEHOLDER_IMAGE}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Product Info */}
                      <div className="p-2 sm:p-3 lg:p-4">
                        <h3 className="text-xs sm:text-sm lg:text-base font-semibold mb-1 sm:mb-2 line-clamp-2 text-gray-800 group-hover:text-purple-600 transition-colors duration-200 min-h-[2.5rem] sm:min-h-[3rem]">
                          {product.name}
                        </h3>

                        <div className="mb-2 sm:mb-3 scale-75 sm:scale-90 lg:scale-100 origin-left">
                          <ProductRating rating={product.rating} />
                        </div>

                        <div className="flex flex-col xs:flex-row xs:items-baseline gap-1">
                          <p className="text-sm sm:text-base lg:text-lg font-bold text-green-600">
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(product.price)}
                          </p>

                          {hasDiscount && (
                            <span className="line-through text-gray-400 text-[10px] sm:text-xs">
                              {new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency: "NGN",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(product.priceBefore)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const showErrorMessage = () => (
    <div className="text-red-500 flex justify-center px-4">
      <div className="py-8 sm:py-12 text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          {errorMessage}
        </p>
        <button
          onClick={loadFeed}
          className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSpinnerBody />;
  if (errorMessage) return showErrorMessage();

  return renderFeed();
};

export default HomeFeed;
