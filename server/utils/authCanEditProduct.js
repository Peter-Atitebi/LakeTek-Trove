// check if current auth can edit a product
const authCanEditProduct = (req, product) => {
  if (product && req.user) {
    if (product.seller.toString() !== req.user.id) return false;
  }
};

module.exports = authCanEditProduct;
