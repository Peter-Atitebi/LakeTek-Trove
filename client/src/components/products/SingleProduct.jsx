//src/components/products/SingleProduct.jsx

import PropTypes from "prop-types";

const SingleProduct = (product, showAddToCart, showRelatedProducts) => {
  if (product && Object.keys(product).length > 0) {
    return (
      <div className="product-details">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className="text-gray-600">₦{product.price?.toFixed(2)}</p>
      </div>
    );
  } else {
    return <p>Product not found.</p>;
  }
};

SingleProduct.propTypes = {
  product: PropTypes.object.isRequired,
  showAddToCart: PropTypes.bool,
  showRelatedProducts: PropTypes.bool,
};

export default SingleProduct;
