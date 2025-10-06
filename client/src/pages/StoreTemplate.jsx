import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_BASE_URL } from "../utils/api";
import AppFooter from "../components/footer/AppFooter";
import AppLayout from "../components/AppLayout";
import LoadingSpinnerBody from "../components/store/LoadingSpinnerBody";
import SingleProduct from "../components/products/SingleProduct";

// Price formatting utility function
const formatPrice = (price, decimals = 2) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) return "0.00";

  return numPrice.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Image URL helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;

  // Remove /api/ from SERVER_BASE_URL and ensure proper path
  const baseUrl = SERVER_BASE_URL.replace("/api/", "/");
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;

  return `${baseUrl}${cleanPath}`;
};

const StoreTemplate = () => {
  const { storeId } = useParams();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);

  useEffect(() => {
    // Only fetch product if productId exists and is not null/undefined
    if (productId && productId !== "undefined" && productId !== "null") {
      getProduct(productId);
    } else {
      setProduct(null); // Clear previous product
      getStoreDetails(storeId);
    }
  }, [storeId, productId]);

  const getProduct = async (prodId) => {
    // Double-check prodId is valid before making request
    if (!prodId || prodId === "undefined" || prodId === "null") {
      setErrorMessage("Invalid product ID");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}products/product/${prodId}`
      );

      if (response.status === 200) {
        if (!response.data) {
          setErrorMessage("Product not found.");
          return;
        }
        setProduct(response.data);
      }
    } catch (error) {
      setErrorMessage(`Error fetching product: ${error.message}`);
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoreDetails = async (storeIdParam) => {
    if (!storeIdParam) {
      setErrorMessage("Invalid store ID");
      return;
    }

    console.log("Getting store details for:", storeIdParam);
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}products/store/${storeIdParam}`
      );
      console.log("Store response:", response.data);

      if (response.status === 200) {
        setStoreDetails(response.data);
        if (response.data) {
          await getStoreProducts(response.data._id);
        }
      }
    } catch (error) {
      console.error("Store details error:", error);
      setErrorMessage(`Error fetching store details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoreProducts = async (storeIdParam) => {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}products/store/${storeIdParam}/products`
      );

      if (response.status === 200) {
        // Ensure storeProducts is always an object with { products, pagination }
        const data = response.data;
        if (Array.isArray(data)) {
          setStoreProducts({ products: data, pagination: null });
        } else {
          setStoreProducts({
            products: data.products || [],
            pagination: data.pagination || null,
          });
        }
      }
    } catch (error) {
      setErrorMessage(`Error fetching store products: ${error.message}`);
      console.error("Error fetching store products:", error);
    }
  };

  const displayErrorMessage = () => {
    if (errorMessage) {
      return (
        <div
          className="error-message border border-red-400 bg-red-100 rounded py-4 px-4 mb-4"
          role="alert"
        >
          <h2 className="text-red-500 text-xl md:text-2xl lg:text-4xl font-bold">
            Something Went Wrong
          </h2>
          <p className="text-red-600">{errorMessage}</p>
        </div>
      );
    }
    return null;
  };

  const displayStoreDetails = () => {
    if (storeDetails && Object.keys(storeDetails).length > 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            {storeDetails.image && (
              <img
                src={getImageUrl(storeDetails.image)}
                alt={storeDetails.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {storeDetails.name || storeDetails.storeName}
              </h1>
              <p className="text-gray-600 text-lg">
                {storeDetails.description || "Welcome to our store"}
              </p>
            </div>
          </div>

          {/* Store Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">
                {storeProducts?.length || 0}
              </p>
              <p className="text-sm text-gray-500">Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">4.5★</p>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-purple-600">2.3k</p>
              <p className="text-sm text-gray-500">Sales</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const StoreProductsDisplay = ({ storeProducts, storeId: storeIdProp }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch products when page changes
    useEffect(() => {
      // If storeProducts prop is provided, use it
      if (storeProducts?.products && Array.isArray(storeProducts.products)) {
        setProducts(storeProducts.products);
        setPagination(storeProducts.pagination);
        setLoading(false);
        return;
      }

      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/products/store/${storeIdProp}/products?page=${currentPage}&limit=24`
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}`, errorText);
            throw new Error("Failed to fetch products. Check server logs.");
          }

          const data = await response.json();
          setProducts(data.products);
          setPagination(data.pagination);
        } catch (error) {
          console.error("Error fetching products:", error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, [storeIdProp, currentPage, storeProducts]);

    // Helper function to format price
    const formatPriceLocal = (price) => {
      if (!price) return "0";
      return parseFloat(price).toLocaleString("en-NG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    };

    // Helper function to get image URL
    const getImageUrlLocal = (image) => {
      if (!image) return "";
      if (image.startsWith("http")) return image;
      return `/api/images/${image}`;
    };

    // Function to handle page navigation
    const handleNextPage = () => {
      if (pagination && pagination.hasMore) {
        setCurrentPage((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const handlePageClick = (pageNum) => {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Function to display products
    const displayStoreProducts = () => {
      if (loading) {
        return (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
      }

      if (products && products.length > 0) {
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Products
            </h2>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() =>
                    window.open(
                      `/store/${storeIdProp}?productId=${prod.id}`,
                      "_blank"
                    )
                  }
                >
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-50">
                    {prod?.image ? (
                      <img
                        src={getImageUrlLocal(prod.image)}
                        alt={prod.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
                          e.target.className =
                            "w-16 h-16 text-gray-300 mx-auto mt-8";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                      {prod.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                      {prod.description}
                    </p>

                    {/* Price and Discount */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-green-600">
                          ₦{formatPriceLocal(prod?.price)}
                        </p>
                        {prod.priceBefore &&
                          parseFloat(prod.priceBefore) >
                            parseFloat(prod.price) && (
                            <p className="text-sm text-gray-500 line-through">
                              ₦{formatPriceLocal(prod.priceBefore)}
                            </p>
                          )}
                      </div>
                      {prod.discount > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                          -{prod.discount}%
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="mt-2">
                      {prod.stock > 0 ? (
                        <span className="text-xs text-green-600 font-medium">
                          In Stock: {prod.stock}
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                {/* Products Count Info */}
                <div className="text-center text-sm text-gray-600 mb-4">
                  Showing {(currentPage - 1) * pagination.productsPerPage + 1}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * pagination.productsPerPage,
                    pagination.totalProducts
                  )}{" "}
                  of {pagination.totalProducts} products
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {/* First page */}
                    {currentPage > 3 && (
                      <React.Fragment key={`first-section-${currentPage}`}>
                        <button
                          onClick={() => handlePageClick(1)}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className="px-2 py-2 text-gray-500">...</span>
                        )}
                      </React.Fragment>
                    )}

                    {/* Page numbers around current page */}
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, index) => index + 1
                    )
                      .filter(
                        (page) =>
                          page === currentPage ||
                          page === currentPage - 1 ||
                          page === currentPage + 1 ||
                          (currentPage <= 2 && page <= 3) ||
                          (currentPage >= pagination.totalPages - 1 &&
                            page >= pagination.totalPages - 2)
                      )
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                    {/* Last page */}
                    {currentPage < pagination.totalPages - 2 && (
                      <React.Fragment key={`last-section-${currentPage}`}>
                        {currentPage < pagination.totalPages - 3 && (
                          <span className="px-2 py-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => handlePageClick(pagination.totalPages)}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {pagination.totalPages}
                        </button>
                      </React.Fragment>
                    )}
                  </div>
                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.hasMore}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-24 w-24 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-500">
            This store doesn't have any products yet.
          </p>
        </div>
      );
    };

    return displayStoreProducts();
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinnerBody />;
    }

    if (errorMessage) {
      return displayErrorMessage();
    }

    if (productId && productId !== "undefined" && productId !== "null") {
      return (
        <SingleProduct
          product={product}
          showAddToCart={true}
          showRelatedProducts={true}
          showMoreItemsFromSeller={true}
        />
      );
    }

    return (
      <div className="max-w-7xl mx-auto p-6">
        {displayStoreDetails()}
        <StoreProductsDisplay storeProducts={storeProducts} storeId={storeId} />
      </div>
    );
  };
  console.log(
    "storeProducts:",
    storeProducts,
    "Type:",
    typeof storeProducts,
    "IsArray:",
    Array.isArray(storeProducts)
  );
  return (
    <>
      <AppLayout>{renderContent()}</AppLayout>
      <AppFooter />
    </>
  );
};

export default StoreTemplate;
