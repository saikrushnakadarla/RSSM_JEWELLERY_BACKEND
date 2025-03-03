// const express = require("express");
// const router = express.Router();
// const ProductController = require("../controllers/productController");
// const multer = require("multer");

// // Configure Multer Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Store images in the 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Unique filename
//   },
// });

// // File Filter to accept only images
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("❌ Only image files are allowed!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// // Define Routes
// router.post("/add-product", upload.single("productImage"), ProductController.addProduct);
// router.get("/get-products", ProductController.getAllProducts);

// module.exports = router;


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

// Multer setup
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
    cb(new Error("Only .png, .jpg and .jpeg formats are allowed!"));
  }
};

const upload = multer({ storage: storage, fileFilter });

// Routes
router.post("/add-product", upload.single("productImage"), productController.addProduct);
router.get("/get-products", productController.getProducts);

module.exports = router;
