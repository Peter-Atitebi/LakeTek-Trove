// check if current auth can edit a product
const jwt = require("jsonwebtoken");

const authCanEditProduct = (req, product) => {
  // Get the token from the header
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  // Remove the "Bearer " prefix from the token string
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return false;
  }

  // check if product belongs to current user

  if (!product.seller || !req.user) {
    return false;
  }

  if (product.seller === undefined || req.user.id == undefined) {
    return false;
  }

  if (product?.seller?.toString() !== req.user.id.toString()) return false;

  return true;
};

module.exports = authCanEditProduct;
