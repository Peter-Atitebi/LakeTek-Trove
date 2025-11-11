// check if current auth can edit a product
const jwt = require("jsonwebtoken");

const authCanEditProduct = (req, product) => {
  console.log("product:", product); // Debugging log
  console.log("req.user:", req.user); // Debugging log

  if (product && req.user) {
    if (product.seller.toString() !== req.user.id) return false;
  }
  return true;
};

module.exports = authCanEditProduct;
