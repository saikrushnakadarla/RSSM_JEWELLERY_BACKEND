const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const multer = require("multer");

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

// File Filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Define Routes
router.post("/add-product", upload.single("productImage"), ProductController.addProduct);
router.get("/get-products", ProductController.getAllProducts);

module.exports = router;
