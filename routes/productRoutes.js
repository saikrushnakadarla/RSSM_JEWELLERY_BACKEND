const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, and .jpeg formats are allowed!"));
  }
};

const upload = multer({ storage: storage, fileFilter });

// Multer setup for Excel file upload
const excelUpload = multer({ dest: "uploads/excel/" });

// Routes
router.post("/add-product", upload.single("productImage"), productController.addProduct);
router.get("/get-products", productController.getProducts);
router.post("/upload-excel", excelUpload.single("file"), productController.uploadExcel); // New Route

module.exports = router;
