const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const Product = require("../models/Product"); // Make sure to import your Product model

// GET /api/store/:id - Get store details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.json(store);
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/store/:id/products - Get products from a specific store
router.get("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;

    // First check if store exists
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Fetch products belonging to this store
    // Adjust the field name based on your Product model structure
    // It might be 'store', 'storeId', 'seller', etc.
    const products = await Product.find({ store: id }).populate("store");

    res.json(products);
  } catch (error) {
    console.error("Error fetching store products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
