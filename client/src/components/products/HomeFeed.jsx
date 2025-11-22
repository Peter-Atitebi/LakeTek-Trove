// src/components/products/HomeFeed.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_BASE_URL } from "../../utils/api";
import useAuthentication from "../../hooks/useAuthentication";
import LoadingSpinnerBody from "../LoadingSpinnerBody";

const HomeFeed = () => {
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { session } = useAuthentication();

  const loadFeed = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(`${SERVER_BASE_URL}products/home-feed`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      });

      setFeed(response.data || []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFeed = () => {
    if (!feed.length) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">No Products Available</h2>
          <p className="text-gray-600">
            Please check back later for new products.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-10 p-4">
        {feed.map((group) => (
          <div key={group.category}>
            {/* Category Title */}
            <h2 className="text-3xl font-bold mb-4">{group.category}</h2>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={
                      product.imageUrl ||
                      "https://dummyimage.com/250x250/f5f5f5/999999.png&text=No+Image+Available"
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover"
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
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const showErrorMessage = () => (
    <div className="text-red-500 flex justify-center">
      <div className="py-6 px-4">
        <h2 className="text-xl md:text-2xl lg:text-4xl font-bold">
          Something went wrong
        </h2>
        <p>{errorMessage}</p>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSpinnerBody />;
  if (errorMessage) return showErrorMessage();

  return renderFeed();
};

export default HomeFeed;
