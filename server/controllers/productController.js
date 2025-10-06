const Product = require("../models/Product");
const processProduct = require("../utils/processProduct");
const Store = require("../models/Store");
const mongoose = require("mongoose"); // Add this import at the top

const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  // Add this validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID format.",
    });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const processedProduct = await processProduct(product);
    return res.status(200).json(processedProduct);
  } catch (error) {
    console.log("error:", error); // Keep for debugging
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    priceBefore,
    category,
    subcategory,
    stock,
  } = req.body;

  const file = req.file ? `/uploads/${req.file.filename}` : null;

  // Optional: If image is mandatory, add a check here
  // if (!file) {
  //   return res.status(400).json({ success: false, message: "Product image is required." });
  // }

  try {
    // Assuming req.user is populated by authentication middleware
    const sellerId = req.user._id; // Access _id if req.user is the full user document or use req.user.id
    const sellerStore = await Store.findOne({ seller: sellerId });

    if (!sellerStore) {
      return res.status(400).json({
        success: false,
        message: "You need to create a store before adding products.",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      priceBefore,
      category,
      subcategory,
      stock,
      image: file,
      store: sellerStore._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error); // Use console.error for errors
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`, // Consistent message
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete product
const deleteProduct = async (req, res) => {};

// get store details

const storeDetails = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid store ID format" });
  }

  try {
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json(store);
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({ message: "Server error" + error.message });
  }
};

// get products of a store

const storeProducts = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid store ID format" });
  }

  try {
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const startIndex = (page - 1) * limit;

    // Fetch paginated products from database
    const products = await Product.find({ store: store._id })
      .populate("store")
      .skip(startIndex)
      .limit(limit);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments({ store: store._id });

    // Process products (with await for async operations)
    const processedProducts = await Promise.all(
      products.map((product) => processProduct(product))
    );

    const response = {
      products: processedProducts,
      pagination: {
        currentPage: page,
        totalProducts: totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        productsPerPage: limit,
        hasMore: page * limit < totalProducts,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching store products:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getSingleProduct,
  storeDetails,
  storeProducts,
};
