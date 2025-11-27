import { useEffect } from "react";
import PropTypes from "prop-types";

const UpdateRecentlyViewed = ({ product }) => {
  useEffect(() => {
    if (product) {
      try {
        let recentlyViewed =
          JSON.parse(localStorage.getItem("recentlyViewed")) || [];

        const isProductInRecentlyViewed = recentlyViewed.some(
          (item) => item.id === product.id
        );
        if (!isProductInRecentlyViewed) {
          recentlyViewed.unshift(product);
          localStorage.setItem(
            "recentlyViewed",
            JSON.stringify(recentlyViewed)
          );
        }
      } catch (error) {
        console.error("Error updating recently viewed products:", error);
      }
    }
  }, [product]);
};

UpdateRecentlyViewed.propTypes = {
  product: PropTypes.object.isRequired,
};

export default UpdateRecentlyViewed;
