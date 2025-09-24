const Product = require("../models/Product");
const processProduct = require("../utils/processProduct");
const Store = require("../models/Store");

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const processedProduct = await processProduct(product);
    return res.status(200).json(processProduct(processedProduct));
    console.log("processedProduct:", processedProduct);
  } catch (error) {
    console.log("error:", error);
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

  try {
    const sellerId = req.user.id; // ← Extract just the ID
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

    console.log(req.body);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const updateProduct = async (req, res) => {};

// delete product
const deleteProduct = async (req, res) => {};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getSingleProduct,
};
