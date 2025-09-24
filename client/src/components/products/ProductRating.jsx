//src/components/products/ProductRating.jsx

// Product Rating Section Component
const ProductRating = ({ rating = 0 }) => {
  const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
  const validRating =
    isNaN(numRating) || numRating < 0 ? 0 : Math.min(numRating, 5);
  const displayRating =
    validRating % 1 === 0 ? validRating.toString() : validRating.toFixed(1);

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-3">
        <StarRating rating={validRating} />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {displayRating} out of 5
          </span>
          {validRating === 0 && (
            <span className="text-sm text-gray-500">
              (No ratings available)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductRating;
