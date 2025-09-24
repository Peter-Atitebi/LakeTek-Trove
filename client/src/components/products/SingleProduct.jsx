//src/components/products/SingleProduct.jsx
import PropTypes from "prop-types";
import MoreItemsFromSeller from "./MoreItemsFromSeller";
import RelatedProducts from "./RelatedProducts";

const SingleProduct = ({
  product,
  showAddToCart,
  showMoreItemsFromSeller,
  showRelatedProducts,
}) => {
  if (product && Object.keys(product).length > 0) {
    return (
      <>
        <div className="product-details">
          <h2>{product?.name}</h2>
          <p>{product?.description}</p>
          <p className="text-gray-600">₦{product?.price?.toFixed(2)}</p>

          {/* Show Add to cart */}
          {showAddToCart && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Add to Cart
            </button>
          )}

          {/* Show more items from seller (store) */}
          {showMoreItemsFromSeller && <MoreItemsFromSeller />}

          {/* Show related products */}
          {showRelatedProducts && <RelatedProducts />}
        </div>
      </>
    );
  } else {
    return (
      <>
        <p>Product not found.</p>;
      </>
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
