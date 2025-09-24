import { useState } from "react";
import PropTypes from "prop-types";
import MoreItemsFromSeller from "./MoreItemsFromSeller";
import RelatedProducts from "./RelatedProducts";

// Price formatting utility function
const formatPrice = (price, decimals = 2) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) return "0.00";

  return numPrice.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Calculate discount percentage
const calculateDiscount = (priceBefore, currentPrice) => {
  const numPriceBefore =
    typeof priceBefore === "string" ? parseFloat(priceBefore) : priceBefore;
  const numCurrentPrice =
    typeof currentPrice === "string" ? parseFloat(currentPrice) : currentPrice;

  if (
    isNaN(numPriceBefore) ||
    isNaN(numCurrentPrice) ||
    numPriceBefore <= 0 ||
    numCurrentPrice <= 0
  ) {
    return 0;
  }

  const discount = ((numPriceBefore - numCurrentPrice) / numPriceBefore) * 100;
  return Math.round(discount);
};

// Star Rating Component
const StarRating = ({ rating = 0 }) => {
  const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
  const validRating =
    isNaN(numRating) || numRating < 0 ? 0 : Math.min(numRating, 5);

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const difference = validRating - i;
    let starType;

    if (difference >= 0) {
      starType = "full";
    } else if (difference > -1) {
      starType = "half";
    } else {
      starType = "empty";
    }

    stars.push(
      <span key={i} className="relative inline-block">
        {starType === "full" && (
          <svg
            className="w-5 h-5 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}

        {starType === "half" && (
          <div className="relative">
            <svg
              className="w-5 h-5 text-gray-300 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <svg
                className="w-5 h-5 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        )}

        {starType === "empty" && (
          <svg
            className="w-5 h-5 text-gray-300 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </span>
    );
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

const SingleProduct = ({
  product,
  showAddToCart,
  showMoreItemsFromSeller,
  showRelatedProducts,
}) => {
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const handleImageClick = () => {
    setIsImageZoomed(true);
  };

  const closeZoomedImage = () => {
    setIsImageZoomed(false);
  };

  // Check if price before exists and is valid
  const hasPriceBefore =
    product?.priceBefore &&
    !isNaN(parseFloat(product.priceBefore)) &&
    parseFloat(product.priceBefore) > 0;

  const discountPercentage = hasPriceBefore
    ? calculateDiscount(product.priceBefore, product.price)
    : 0;

  if (product && Object.keys(product).length > 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
            {/* Product Image */}
            <div className="flex-1 space-y-4">
              {product?.image ? (
                <div
                  className="relative cursor-pointer"
                  onClick={handleImageClick}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square sm:aspect-auto sm:h-96 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square sm:aspect-auto sm:h-96 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
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
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {product?.name}
                </h1>

                {/* Price with Discount and Original Price */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Discount Badge */}
                    {discountPercentage > 0 ? (
                      <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        -{discountPercentage}%
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        0% discount
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Current Price */}
                    <span className="text-2xl sm:text-3xl font-semibold text-green-600">
                      ₦{formatPrice(product?.price)}
                    </span>

                    {/* Original Price (if exists) */}
                    {hasPriceBefore && (
                      <span className="text-lg sm:text-xl font-medium text-gray-500 line-through">
                        ₦{formatPrice(product.priceBefore)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product?.description}
                </p>
              </div>

              {/* Add to Cart Button */}
              {showAddToCart && (
                <div className="mb-6 sm:mb-8">
                  <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 sm:px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm">
                    Add to Cart
                  </button>
                </div>
              )}

              {/* Product Rating */}
              <ProductRating rating={product?.rating} />
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

        {/* Image Zoom Modal */}
        {isImageZoomed && product?.image && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeZoomedImage}
          >
            <button
              onClick={closeZoomedImage}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full max-w-none">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-h-screen object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    );
  } else {
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v1M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1"
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
};

SingleProduct.propTypes = {
  product: PropTypes.object.isRequired,
  showAddToCart: PropTypes.bool,
  showMoreItemsFromSeller: PropTypes.bool,
  showRelatedProducts: PropTypes.bool,
};

export default SingleProduct;
