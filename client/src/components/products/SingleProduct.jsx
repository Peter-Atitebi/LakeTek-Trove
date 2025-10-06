import { useState } from "react";
import PropTypes from "prop-types";
import MoreItemsFromSeller from "./MoreItemsFromSeller";
import RelatedProducts from "./RelatedProducts";
import ProductRating from "../products/ProductRating";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Price formatting utility
const formatPrice = (price, decimals = 2) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numPrice)) return "0.00";
  return numPrice.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const SingleProduct = ({
  product,
  showAddToCart,
  showMoreItemsFromSeller,
  showRelatedProducts,
}) => {
  // Early return if product is null/undefined
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 00-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v1M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Product Not Found
            </p>
            <p className="text-gray-500">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const store = product.store;
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const handleImageClick = () => setIsImageZoomed(true);
  const closeZoomedImage = () => setIsImageZoomed(false);

  const hasPriceBefore =
    product?.priceBefore &&
    !isNaN(parseFloat(product.priceBefore)) &&
    parseFloat(product.priceBefore) > 0;

  const handleOpenStore = () => {
    if (store && store._id) {
      window.open(`/store/${product.storeId}`, "_blank");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Layout: Product info + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Product Image & Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product Image */}
            <div className="flex-1 space-y-4">
              {product?.image && product.image.trim() !== "" ? (
                <div
                  className="relative cursor-pointer"
                  onClick={handleImageClick}
                >
                  <div className="w-full aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Hide the entire image container and show fallback
                        e.target.closest(".relative").style.display = "none";
                        e.target
                          .closest(".flex-1")
                          .querySelector(
                            ".fallback-placeholder"
                          ).style.display = "flex";
                      }}
                    />
                  </div>
                </div>
              ) : null}

              {/* Fallback placeholder */}
              <div
                className={`w-full aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center fallback-placeholder ${
                  product?.image && product.image.trim() !== "" ? "hidden" : ""
                }`}
              >
                <div className="text-center text-gray-400">
                  <svg
                    className="mx-auto h-16 w-16 mb-2"
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
                  <p className="text-sm">No image available</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {product?.name}
              </h1>

              {/* Price & Discount */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {product.discount > 0 ? (
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      -{product.discount}% off
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      0% discount
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-semibold text-green-600">
                    ₦{formatPrice(product?.price)}
                  </span>
                  {hasPriceBefore && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      ₦{formatPrice(product.priceBefore)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Info */}
              <div className="mb-4">
                {product?.stock > 0 ? (
                  <span className="text-sm font-medium text-green-700">
                    In Stock: {product.stock}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-600">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Shipping Info */}
              {product?.shippingInfo && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    {product.shippingInfo}
                  </p>
                </div>
              )}

              {/* Rating */}
              <ProductRating rating={product?.rating} />

              {/* Add to Cart */}
              {showAddToCart && (
                <div className="my-6">
                  <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition">
                    Add to Cart
                  </button>
                </div>
              )}

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Store Info */}

        <div className="space-y-6">
          {/* Delivery & Returns */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4  hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Delivery & Returns
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Shipped from abroad Details
            </p>
            <hr />
          </div>
          {/* Seller Info */}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4  hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div
              className="flex items-center justify-between mb-4"
              onClick={handleOpenStore}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-3 cursor-pointer">
                Seller Information
              </h3>
              <ArrowForwardIcon className="text-gray-600  cursor-pointer hover:text-gray-400 shadow-sm transition" />
            </div>

            <p className="text-sm text-gray-700 font-medium">
              {store?.storeName || "Unknown Seller"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {store?.description || "No performance data"}
            </p>
          </div>
        </div>
      </div>

      {/* More Items from Seller */}
      {showMoreItemsFromSeller && (
        <div className="mb-8">
          <MoreItemsFromSeller product={product} />
        </div>
      )}

      {/* Related Products */}
      {showRelatedProducts && (
        <div className="mb-8">
          <RelatedProducts product={product} />
        </div>
      )}

      {/* Zoom Modal */}
      {isImageZoomed && product?.image && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeZoomedImage}
        >
          <button
            onClick={closeZoomedImage}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            ✕
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-screen object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

SingleProduct.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    priceBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    discount: PropTypes.number,
    stock: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    store: PropTypes.object,
  }).isRequired,
  showAddToCart: PropTypes.bool,
  showMoreItemsFromSeller: PropTypes.bool,
  showRelatedProducts: PropTypes.bool,
};

export default SingleProduct;
