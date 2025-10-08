//src/components/products/ProductRating.jsx

import PropTypes from "prop-types";

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

// Product Rating Section Component
const ProductRating = ({ rating = 0 }) => {
  const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
  const validRating =
    isNaN(numRating) || numRating < 0 ? 0 : Math.min(numRating, 5);
  const displayRating = validRating.toFixed(1);

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-3">
        <StarRating rating={validRating} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-900 bg-blue-50 px-2 py-1 rounded">
            {displayRating}
          </span>
        </div>
      </div>
    </div>
  );
};

ProductRating.propTypes = {
  ProductRating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  SellerRating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ProductRating;
export { StarRating };
