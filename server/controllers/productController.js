const Product = require("../models/Product");
const createProduct = async (req, res) => {
  // const product = new Product(req.body);
  // await product.save();

  const {
    name,
    description,
    price,
    priceBefore,
    category,
    subcategory,
    stock,
  } = new Product(req.body);

  const file = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const product = new Product({
      name,
      description,
      price,
      priceBefore,
      category,
      subcategory,
      stock,
      image: file,
    });
    await product.save();

    console.log(req.body);

    res.status(201).json(product);
  } catch (error) {
    // handle error

    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const updateProduct = async (req, res) => {};

const getProduct = async (req, res) => {};

// delete product
const deleteProduct = async (req, res) => {};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getProduct,
};
