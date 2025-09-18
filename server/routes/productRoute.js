const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const multer = require("multer");

// set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads"); // specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // specify the file name
  },
});

// upload
const upload = multer({ storage });

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require("../controllers/productController");

// routes
router.post("/create", authenticate, upload.single("image"), createProduct);
router.put("/update/:id", authenticate, updateProduct);
router.delete("/delete/:id", authenticate, deleteProduct);
router.get("/product/:id", getProduct);

// exports
module.exports = router;
