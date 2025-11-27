const Product = require("../models/Product");
const processProduct = require("../utils/processProduct");
const Store = require("../models/Store");
const mongoose = require("mongoose");
const authCanEditProduct = require("../utils/authCanEditProduct");

// get single product details

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
    processedProduct.authCanEditProduct = authCanEditProduct(req, product);

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
    user,
  } = req.body;

  console.log("Decoded user:", req.user);

  const file = req.file ? `/uploads/${req.file.filename}` : null;

  // Optional: If image is mandatory, add a check here
  // if (!file) {
  //   return res.status(400).json({ success: false, message: "Product image is required." });
  // }

  try {
    // Assuming req.user is populated by authentication middleware
    const seller = req.user._id || req.user.id || req.user.userId; // Access _id if req.user is the full user document or use req.user.id
    const sellerStore = await Store.findOne({ seller });

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
      seller,
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

const updateProduct = async (req, res) => {};

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
      .sort({ createdAt: -1 }) // ← Add this line - newest first
      .skip(startIndex)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const totalProducts = await Product.countDocuments({ store: store._id });

    // Process products (with await for async operations)
    const processedProducts = await Promise.all(
      products.map((product) => processProduct(product))
    );

    console.log("Processed Products:", processedProducts); // Debugging log

    // Construct response with pagination info

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

const storeProductsBySeller = async (req, res) => {
  const seller = req.user.id;

  if (!seller) {
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized User" });
  }
  try {
    const store = await Store.findOne({ seller });
    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }
    const products = await Product.find({ store: store._id })
      .populate("store")
      .sort({ createdAt: -1 }); // newest first
    const processedProducts = await Promise.all(
      products.map(async (product) => await processProduct(product))
    );
    return res.status(200).json(processedProducts);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error });
  }
};

const homeFeed = async (req, res) => {
  try {
    const products = await Product.aggregate([
      // Sort newest first
      { $sort: { createdAt: -1 } },

      // Group by category
      {
        $group: {
          _id: "$category",
          products: { $push: "$$ROOT" },
        },
      },

      // Limit to 4 per category
      {
        $project: {
          category: "$_id",
          products: { $slice: ["$products", 4] },
        },
      },
    ]);

    // Process each product
    const processedProducts = await Promise.all(
      products.map(async (group) => {
        const processedGroup = await Promise.all(
          group.products.map((p) => processProduct(p))
        );

        return {
          category: group.category,
          products: processedGroup.filter(Boolean), // remove nulls
        };
      })
    );

    // Only include categories with at least 1 product
    const finalFeed = processedProducts.filter((g) => g.products.length > 0);

    res.status(200).json(finalFeed);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Get all products in a category (paginated)
const categoryProducts = async (req, res) => {
  const category = decodeURIComponent(req.params.category);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 24;
  const startIndex = (page - 1) * limit;

  if (!category) {
    return res
      .status(400)
      .json({ success: false, message: "Category is required" });
  }

  try {
    const regex = new RegExp(category, "i");

    const products = await Product.find({ category: regex })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .lean();

    const totalProducts = await Product.countDocuments({ category: regex });

    // ADD THIS: Process products to get proper image URLs
    const processedProducts = await Promise.all(
      products.map((product) => processProduct(product))
    );

    res.status(200).json({
      category,
      products: processedProducts, // ← Use processed products
      pagination: {
        currentPage: page,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        productsPerPage: limit,
        hasMore: page * limit < totalProducts,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};
// Get best deals (products with priceBefore > price)
const bestDeals = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $and: [
          { $gt: ["$priceBefore", "$price"] },
          {
            $gte: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$priceBefore", "$price"] },
                      "$priceBefore",
                    ],
                  },
                  100,
                ],
              },
              20,
            ],
          },
        ],
      },
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Handle empty results
    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }

    const processedProducts = await Promise.all(
      products.map((product) => processProduct(product))
    );

    res.status(200).json(processedProducts);
  } catch (error) {
    console.error("Best deals error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getSingleProduct,
  storeDetails,
  storeProducts,
  storeProductsBySeller,
  homeFeed,
  categoryProducts,
  bestDeals,
};
