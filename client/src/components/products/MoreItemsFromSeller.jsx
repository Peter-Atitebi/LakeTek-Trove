// src/components/products/MoreItemsFromSeller.jsx
import PropTypes from "prop-types";

// Price formatting utility function
const formatPrice = (price, decimals = 2) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) return "0.00";

  return numPrice.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const MoreItemsFromSeller = ({ product, title = "More from this Seller" }) => {
  // Mock data for demo - replace with actual API call
  const mockProducts = [
    {
      _id: "1",
      name: "Product 1",
      price: 29999, // Updated to show comma formatting
      image:
        "https://dummyimage.com/250x250/f5f5f5/999999.png&text=Seller+Product+Image",
    },
    {
      _id: "2",
      name: "Product 2",
      price: 1234567.5, // Large number example
      image:
        "https://dummyimage.com/250x250/f5f5f5/999999.png&text=Seller+Product+Image",
    },
    {
      _id: "3",
      name: "Product 3",
      price: 80000, // Your example
      image:
        "https://dummyimage.com/250x250/f5f5f5/999999.png&text=Seller+Product+Image",
    },
    {
      _id: "4",
      name: "Product 4",
      price: 75654567, // Large number example
      image:
        "https://dummyimage.com/250x250/f5f5f5/999999.png&text=Seller+Product+Image",
    },
  ];

  return (
    <section className="mt-8 mb-8 w-full">
      {/* Section Header */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-2 inline-block">
          {title}
        </h3>
      </div>
      {/* Products Flexbox Layout */}
      <div className="flex flex-wrap -mx-2 md:-mx-3">
        {mockProducts.map((item) => (
          <div
            key={item._id}
            className="w-1/2 sm:w-1/3 lg:w-1/4 xl:w-1/5 p-2 md:p-3"
          >
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 group cursor-pointer h-full flex flex-col">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Product Info */}
              <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                <h4 className="text-sm md:text-base font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between mt-auto">
                  {/* Formatted Price with Commas */}
                  <span className="text-lg font-bold text-blue-600">
                    ₦{formatPrice(item.price)}
                  </span>
                  {/* Quick Add Button */}
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View All Button */}
      <div className="text-center mt-8">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 border">
          View All from Seller
        </button>
      </div>
    </section>
  );
};

MoreItemsFromSeller.propTypes = {
  product: PropTypes.object.isRequired,
  title: PropTypes.string, // Optional title prop for reusability
};

export default MoreItemsFromSeller;
