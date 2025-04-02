const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

// Ensure the necessary directories exist
const uploadDir = path.join(__dirname, "../uploads/images");
const excelDir = path.join(__dirname, "../uploads/excel");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

// Multer setup for image and video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png/;
  const allowedVideoTypes = /mp4|mkv|avi/;
  const extname =
    allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
    allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    allowedImageTypes.test(file.mimetype) ||
    allowedVideoTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg, .mp4, .mkv, and .avi formats are allowed!"));
  }
};

const upload = multer({ storage: storage, fileFilter });
const excelUpload = multer({ dest: "uploads/excel/" });

// ✅ Add Product Route
router.post(
  "/add-product-multiple-image",
  upload.fields([{ name: "productImage", maxCount: 5 }, { name: "videoFile", maxCount: 1 }]),
  (req, res) => {
    const {
      category,
      subcategory,
      designName,
      purity,
      grossWeight,
      stoneWeight,
      stonePrice,
      rate,
      total_amount,
      weightBeforeWastage,
      making_charge,
      makingChargePercentage,
      total_mc,
      wastageOn,
      wastagePercentage,
      wastageWeight,
      totalWeight,
      huidNumber,
      total_price,
      product_code,
      vendor_id,
      vendor_name,
      size,
    } = req.body;

    const productImages = req.files["productImage"]
    ? req.files["productImage"].map((file) => file.filename).join(",")
    : null;
  

    const videoFile = req.files["videoFile"] ? req.files["videoFile"][0].filename : null;

    if (!category || !subcategory || !purity || !rate) {
      return res.status(400).json({ error: "All required fields must be filled!" });
    }

    const query = `
      INSERT INTO products (
        category, subcategory, design_name, purity, gross_weight, 
        stone_weight, stone_price, rate, total_amount, weight_before_wastage, 
        making_charge, making_charge_percentage, total_mc, wastage_on, 
        wastage_percentage, wastage_weight, total_weight, huid_number, product_image, 
        total_price, product_code, vendor_id, vendor_name, size, video_file  
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      category,
      subcategory,
      designName,
      purity,
      grossWeight,
      stoneWeight || 0,
      stonePrice || 0,
      rate,
      total_amount,
      weightBeforeWastage || 0,
      making_charge || 0,
      makingChargePercentage || 0,
      total_mc || 0,
      wastageOn || "",
      wastagePercentage || 0,
      wastageWeight || 0,
      totalWeight || 0,
      huidNumber || "",
      productImages,
      total_price || 0,
      product_code,
      vendor_id,
      vendor_name,
      size,
      videoFile,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ error: "Database error while adding product" });
      }
      res.status(201).json({ message: "✅ Product added successfully!", id: result.insertId });
    });
  }
);

module.exports = router;