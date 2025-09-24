import { useParams } from "react-router-dom";
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

const StoreTemplate = () => {
  const { storeId } = useParams();
  const [productId, setProductId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState({});
  const [storeDetails, setStoreDetails] = useState({});
  const [storeProducts, setStoreProducts] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get("productId");
    setProductId(prodId);

    if (prodId) {
      getProduct(prodId);
    } else {
      getStoreDetails(storeId);
    }
  }, [storeId, window.location.search]); // Add search params as dependency

  const getProduct = async (productId) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}products/product/${productId}`
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

  const getStoreDetails = async (storeId) => {
    console.log("Getting store details for:", storeId); // Debug log
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(`${SERVER_BASE_URL}stores/${storeId}`);
      console.log("Store response:", response.data); // Debug log

      if (response.status === 200) {
        setStoreDetails(response.data);
        if (response.data) {
          await getStoreProducts(response.data._id);
        }
      }
    } catch (error) {
      console.error("Store details error:", error); // Debug log
      setErrorMessage(`Error fetching store details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoreProducts = async (storeId) => {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}stores/${storeId}/products`
      );

      if (response.status === 200) {
        setStoreProducts(response.data);
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
          {/* Title */}
          <h2 className="text-red-500 text-xl md:text-2xl lg:text-4xl font-bold">
            Something Went Wrong
          </h2>
          {/* Body */}
          <p className="text-red-600">{errorMessage}</p>
        </div>
      );
    }
    return null;
  };

  const displayStoreDetails = () => {
    if (storeDetails && Object.keys(storeDetails).length > 0) {
      return (
        <div className="store-details">
          <h3>{storeDetails.name}</h3>
          <p>{storeDetails.description}</p>
        </div>
      );
    }
    return null;
  };

  const displayStoreProducts = () => {
    if (storeProducts && storeProducts.length > 0) {
      return (
        <div className="store-products">
          <div className="products-grid">
            {storeProducts.map((prod) => (
              <div key={prod._id} className="product-card">
                <h4>{prod.name}</h4>
                <p>{prod.description}</p>
                <p className="text-gray-600">₦{formatPrice(prod?.price)}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <p>No products found for this store.</p>;
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinnerBody />;
    }

    if (errorMessage) {
      return displayErrorMessage();
    }

    if (productId) {
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
      <div>
        <h1>Store</h1>
        {displayStoreDetails()}
        <h2>Products</h2>
        {displayStoreProducts()}
      </div>
    );
  };

  return (
    <>
      <AppLayout>{renderContent()}</AppLayout>
      <AppFooter />
    </>
  );
};

export default StoreTemplate;
