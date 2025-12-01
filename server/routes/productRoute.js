const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// check if uploads directory exists, if not create it
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // specify the upload directory
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

// upload
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    return mimeType && extName
      ? cb(null, true)
      : cb(new Error("Only images are allowed"));
  },
});

// import controllers
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  storeDetails,
  storeProducts,
  storeProductsBySeller,
  homeFeed,
  categoryProducts,
  bestDeals,
} = require("../controllers/productController");

// routes
router.post("/create", [authenticate, upload.single("image")], createProduct);
router.put("/update/:id", authenticate, updateProduct);
router.delete("/delete/:id", authenticate, deleteProduct);
router.get("/product/:id", getSingleProduct);
router.get("/store/:id", storeDetails);
router.get("/store/:id/products", storeProducts);
router.get("/seller/all", authenticate, storeProductsBySeller); // only for authenticated store owners
router.get("/home-feed", homeFeed);
router.get("/category/:category", categoryProducts);
router.get("/best-deals", bestDeals);


// exports
module.exports = router;
