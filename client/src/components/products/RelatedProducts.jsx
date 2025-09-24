//src/components/products/RelatedProducts.jsx

import PropTypes from "prop-types";

const RelatedProducts = ({ product }) => {
  // Mock data for demo - replace with actual API call based on product category/tags
  const mockRelatedProducts = [
    {
      _id: "1",
      name: "Similar Product 1",
      price: 25.99,
      image:
        "https://dummyimage.com/250x250/f5f5f5/999999.png&text=Related+Product+Image",
    },
    {
      _id: "2",
      name: "Similar Product 2",
      price: 35.99,
      image:
        "https://dummyimage.com/250x250/f5f5f5/999999.png&text=Related+Product+Image",
    },
    {
      _id: "3",
      name: "Similar Product 3",
      price: 22.99,
      image:
        "https://dummyimage.com/250x250/f5f5f5/999999.png&text=Related+Product+Image",
    },
    {
      _id: "4",
      name: "Similar Product 4",
      price: 45.99,
      image:
        "https://dummyimage.com/250x250/f5f5f5/999999.png&text=Related+Product+Image",
    },
  ];

  return (
    <section className="mt-8 mb-8 w-full">
      {/* Section Header */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 border-b-2 border-green-500 pb-2 inline-block">
          Related Products
        </h3>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {mockRelatedProducts.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4">
              <h4 className="text-sm md:text-base font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                {item.name}
              </h4>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  ₦{item.price.toFixed(2)}
                </span>

                {/* Quick Add Button */}
                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full text-sm">
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
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-8">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 border">
          View More Related Products
        </button>
      </div>
    </section>
  );
};

RelatedProducts.propTypes = {
  product: PropTypes.object.isRequired,
};

export default RelatedProducts;
