// src/utils/processProduct.js

// Get image full path (URL), store info, rating info, etc.

const Store = require("../models/Store");

const processProduct = async (product) => {
  if (!product) return null;

  const BASE_URL = process.env.BASE_URL || "http://localhost";
  const PORT = process.env.PORT || 5001;
  const IMAGE_PLACEHOLDER =
    process.env.IMAGE_PLACEHOLDER ||
    "https://dummyimage.com/250x250/f5f5f5/999999.png&text=No+Image+Available";
  const image = product.image
    ? `${BASE_URL}:${PORT}${product.image}`
    : `${IMAGE_PLACEHOLDER}`;
  const store = await Store.findById(product.store);

  // calculate discount percentage
  function calculateDiscount(price, priceBefore) {
    if (!priceBefore || priceBefore <= price) return 0;
    return Math.round(((priceBefore - price) / priceBefore) * 100);
  }
  try {
    return {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      priceBefore: product.priceBefore,
      category: product.category,
      subcategory: product.subcategory,
      stock: product.stock,
      image: image,
      store: store,
      discount: calculateDiscount(product.price, product.priceBefore),
      createdAt: product.createdAt,
      storeId: product.store,
    };
  } catch (error) {
    console.error("Error processing product:", error);
    throw new Error("Error processing product:" + error);
  }
};

module.exports = processProduct;
