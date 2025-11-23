// src/components/products/CategoryPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { SERVER_BASE_URL } from "../../utils/api";
import useAuthentication from "../../hooks/useAuthentication";
import LoadingSpinnerBody from "../../components/LoadingSpinnerBody";

const PLACEHOLDER_IMAGE =
  "https://dummyimage.com/250x250/f5f5f5/999999.png&text=No+Image+Available";

const CategoryPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pagination, setPagination] = useState({});
  const { session } = useAuthentication();

  const loadProducts = async (page = 1) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}category/${encodeURIComponent(category)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          params: { page, limit: 24 }, // adjust limit per screen or preference
        }
      );

      setProducts(response.data.products || []);
      setPagination(response.data.pagination || {});
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadProducts(pageParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, pageParam]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (isLoading) return <LoadingSpinnerBody />;

  if (errorMessage)
    return (
      <div className="text-red-500 flex justify-center py-6">
        <div>
          <h2 className="text-2xl font-bold">Error</h2>
          <p>{errorMessage}</p>
        </div>
      </div>
    );

  if (!products.length)
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">No Products in "{category}"</h2>
        <p className="text-gray-600">Check back later for new products.</p>
      </div>
    );

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const hasDiscount =
            product.priceBefore && product.priceBefore > product.price;
          const discountPercentage = hasDiscount
            ? Math.round(
                ((product.priceBefore - product.price) / product.priceBefore) *
                  100
              )
            : 0;

          return (
            <Link
              key={product._id}
              to={`/store/${product.storeId}?productId=${product.id}`}
              className="relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
            >
              {hasDiscount && (
                <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{discountPercentage}%
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
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(product.price)}
                  {hasDiscount && (
                    <span className="line-through text-gray-400 ml-2">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(product.priceBefore)}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-4 mt-6">
        {pagination.currentPage > 1 && (
          <button
            className="px-4 py-2 border rounded hover:bg-gray-200"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            Previous
          </button>
        )}

        {pagination.hasMore && (
          <button
            className="px-4 py-2 border rounded hover:bg-gray-200"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
