// src/components/products/CategoryPage.jsx
import { useParams, Link } from "react-router-dom";
import AppLayout from "../AppLayout";
import AppFooter from "../footer/AppFooter";
import LoadingSpinnerBody from "../LoadingSpinnerBody";
import axios from "axios";
import { useState, useEffect } from "react";
import { SERVER_BASE_URL } from "../../utils/api";
import useAuthentication from "../../hooks/useAuthentication";
import PLACEHOLDER_IMAGE from "../../utils/api";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { session } = useAuthentication();

  useEffect(() => {
    if (!isLoading) {
      getProducts();
    }
  }, [session?.token]);

  const getProducts = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}products/category/${encodeURIComponent(category)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      setProducts(response.data.products || []);

      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error.message);
      setIsLoading(false);
    }
  };

  // show products
  const showProducts = () => {
    if (products.length > 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {category}
            </h1>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              found
            </p>
            <div className="mt-4 h-1 w-20 bg-orange-500 rounded"></div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const prodHasDiscount =
                product.priceBefore && product.priceBefore > product.price;

              const discountPercent = prodHasDiscount
                ? Math.round(
                    ((product.priceBefore - product.price) /
                      product.priceBefore) *
                      100
                  )
                : 0;

              return (
                <Link
                  key={product._id}
                  to={`/store/${product.storeId}?productId=${product.id}`}
                  className="block group"
                >
                  <div className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                    {/* Discount Badge */}
                    {prodHasDiscount && (
                      <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                        -{discountPercent}%
                      </span>
                    )}

                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gray-100">
                      <img
                        src={product.image || PLACEHOLDER_IMAGE}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2 group-hover:text-orange-500 transition-colors">
                        {product.name}
                      </h3>

                      {/* Price Section */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xl font-bold text-gray-900">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(product.price)}
                        </p>

                        {prodHasDiscount && (
                          <span className="text-sm line-through text-gray-400">
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
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
      );
    } else {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-600">
              No products found in the "{category}" category.
            </p>
          </div>
        </div>
      );
    }
  };

  // show error message
  const showErrorMessage = () => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline ml-2">{errorMessage}</span>
    </div>
  );

  return (
    <>
      <AppLayout>
        {isLoading ? (
          <LoadingSpinnerBody />
        ) : (
          <>{errorMessage ? showErrorMessage() : showProducts()}</>
        )}
      </AppLayout>

      {/* footer */}
      <AppFooter />
    </>
  );
};

export default CategoryPage;
