import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_BASE_URL } from "../utils/api";
import AppFooter from "../components/footer/AppFooter";
import AppLayout from "../components/AppLayout";
import LoadingSpinnerBody from "../components/store/LoadingSpinnerBody";

const StoreTemplate = () => {
  const { storeId } = useParams();
  const [productId, setProductId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState({});
  const [storeDetails, setStoreDetails] = useState({});
  const [storeProducts, setStoreProducts] = useState([]);

  // use effect to get product Id
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get("productId");
    setProductId(prodId);
    if (prodId) {
      getProduct(prodId);
    } else {
      // Get store products
      getStoreDetails(storeId);
    }
  }, [storeId]); // Added storeId to dependency array

  const getProduct = async (productId) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}products/${productId}`
      );
      if (response.status === 200) {
        if (!response.data) {
          setErrorMessage("Product not found.");
          setIsLoading(false);
          return;
        }
        setProduct(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(`Error fetching product: ${error.message}`);
      console.error("Error fetching product:", error);
    }
  };

  // Get store details
  const getStoreDetails = async (storeId) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(`${SERVER_BASE_URL}stores/${storeId}`);
      if (response.status === 200) {
        setStoreDetails(response.data);
        if (response.data) {
          getStoreProducts(response.data._id);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(`Error fetching store details: ${error.message}`);
      console.log("Error fetching store details:", error);
    }
  };

  // Get Store Products
  const getStoreProducts = async (storeId) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}stores/${storeId}/products`
      );
      if (response.status === 200) {
        setStoreProducts(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(`Error fetching store products: ${error.message}`);
      console.log("Error fetching store products:", error);
    }
  };

  const checkIfLoading = () => {
    if (isLoading) {
      return <LoadingSpinnerBody />;
    }
  };

  // Display error message if any
  const displayErrorMessage = () => {
    if (errorMessage) {
      return <p className="text-red-500">{errorMessage}</p>;
    }
  };

  // Display single product
  const displayProduct = () => {
    if (product && Object.keys(product).length > 0) {
      return (
        <div className="product-details">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p className="text-gray-600">${product.price?.toFixed(2)}</p>
          {/* Add more product details as needed */}
        </div>
      );
    }
  };

  // Display store products
  const displayStoreProducts = () => {
    if (storeProducts && storeProducts.length > 0) {
      return (
        <div className="store-products">
          <h2>Products from {storeDetails.name || "Store"}</h2>
          <div className="products-grid">
            {storeProducts.map((prod) => (
              <div key={prod._id} className="product-card">
                <h3>{prod.name}</h3>
                <p>{prod.description}</p>
                <p className="text-gray-600">${prod.price?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (!isLoading && storeProducts.length === 0) {
      return <p>No products found for this store.</p>;
    }
  };

  // Show loading spinner if loading
  if (isLoading) {
    return (
      <>
        <AppLayout>
          <LoadingSpinnerBody />
        </AppLayout>
        <AppFooter />
      </>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="store-template">
          <h1>Store Template Page</h1>

          {/* Display error message */}
          {displayErrorMessage()}

          {/* Display content based on whether we're showing a product or store */}
          {productId ? (
            // Single product view
            <div>
              <h2>Product Details</h2>
              {displayProduct()}
            </div>
          ) : (
            // Store products view
            <div>
              {storeDetails.name && <h2>Welcome to {storeDetails.name}</h2>}
              {storeDetails.description && <p>{storeDetails.description}</p>}
              {displayStoreProducts()}
            </div>
          )}
        </div>
      </AppLayout>

      {/* Footer */}
      <AppFooter />
    </>
  );
};

export default StoreTemplate;
