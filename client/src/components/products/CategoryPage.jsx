// src/components/products/CategoryPage.jsx
import { useParams, Link } from "react-router-dom";
import AppLayout from "../AppLayout";
import AppFooter from "../footer/AppFooter";
import LoadingSpinnerBody from "../LoadingSpinnerBody";
import axios from "axios";
import { useState, useEffect } from "react";
import { SERVER_BASE_URL } from "../../utils/api";
import useAuthentication from "../../hooks/useAuthentication";
import PropTypes from "prop-types";
import PLACEHOLDER_IMAGE from "../../utils/api";
import { div } from "framer-motion/client";

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
      setProducts(response.data || []);
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
        <>
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
                className="block"
              >
                <div className="relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
                  {/* Discount Badge */}
                  {prodHasDiscount && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{discountPercent}%
                    </span>
                  )}

                  <img
                    src={product.image || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 mb-4">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(product.price)}

                      {prodHasDiscount && (
                        <span className="line-through text-gray-400 ml-2">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(product.priceBefore)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </>
      );
    } else {
      return (
        <p className="text-gray-600">
          No products found in the {category} category.
        </p>
      );
    }
  };

  // show error message

  return (
    <>
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Category: {category}</h1>
          <p className="text-gray-600">
            This is a placeholder for the {category} category page.
          </p>
        </div>
      </AppLayout>

      {/* footer */}
      <AppFooter />
    </>
  );
};

export default CategoryPage;
