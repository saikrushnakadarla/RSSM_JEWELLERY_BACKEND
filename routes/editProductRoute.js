const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure this points to your database connection file
const multer = require("multer"); // Import multer

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images"); // Define the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Rename the file
    },
});

const upload = multer({ storage: storage }); // Initialize multer

// Get product by ID
router.get("/get-product/:id", (req, res) => {
    const productId = req.params.id;
    const query = "SELECT * FROM products WHERE id = ?";

    db.query(query, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(results[0]); // Return the first matching product
    });
});

router.put(
    "/update-product/:id",
    upload.fields([{ name: "productImage", maxCount: 5 }, { name: "videoFile", maxCount: 1 }]),
    (req, res) => {
      const productId = req.params.id;
  
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
        vendor_address,
      vendor_business_name,
      vendor_mobile,
      vendor_city,
      vendor_pincode,
      vendor_state
      } = req.body;
  
      // Handle image uploads
      const productImages = req.files["productImage"]
        ? req.files["productImage"].map((file) => file.filename).join(",")
        : null;
  
      // Handle video upload
      const videoFile = req.files["videoFile"] ? req.files["videoFile"][0].filename : null;
  
      // Validate required fields
      if (!category || !subcategory || !purity || !rate) {
        return res.status(400).json({ error: "All required fields must be filled!" });
      }
  
      // Fetch existing product data
      const getProductQuery = "SELECT * FROM products WHERE id = ?";
      db.query(getProductQuery, [productId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error", details: err });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: "Product not found" });
        }
  
        const existingProduct = results[0];
        const existingImages = existingProduct.product_image ? existingProduct.product_image.split(",") : [];
        const existingVideo = existingProduct.video_file || null;
  
        // Combine new and existing images
        const finalImages = productImages ? [...req.files["productImage"].map(file => file.filename), ...existingImages].join(",") : existingImages.join(",");
        const finalVideo = videoFile || existingVideo;
  
        // Update product in the database
        const updateQuery = `
          UPDATE products SET
            category = ?,
            subcategory = ?,
            design_name = ?,
            purity = ?,
            gross_weight = ?,
            stone_weight = ?,
            stone_price = ?,
            rate = ?,
            total_amount = ?,
            weight_before_wastage = ?,
            making_charge = ?,
            making_charge_percentage = ?,
            total_mc = ?,
            wastage_on = ?,
            wastage_percentage = ?,
            wastage_weight = ?,
            total_weight = ?,
            huid_number = ?,
            product_image = ?,
            total_price = ?,
            product_code = ?,
            vendor_id = ?,
            vendor_name = ?,
            size = ?,
            video_file = ?,
            vendor_address=?,
      vendor_business_name=?,
      vendor_mobile=?,
      vendor_city=?,
      vendor_pincode=?,
      vendor_state=?
          WHERE id = ?`;
  
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
          finalImages,
          total_price || 0,
          product_code,
          vendor_id,
          vendor_name,
          size,
          finalVideo,
          vendor_address,
      vendor_business_name,
      vendor_mobile,
      vendor_city,
      vendor_pincode,
      vendor_state,
          productId,
          
        ];
  
        db.query(updateQuery, values, (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: "Database error", details: updateErr });
          }
          res.json({ message: "✅ Product updated successfully!", product_image: finalImages, video_file: finalVideo });
        });
      });
    }
  );
  



// Delete Product
router.delete("/delete-product/:id", (req, res) => {
    const productId = req.params.id;
    const query = "DELETE FROM products WHERE id = ?";

    db.query(query, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        res.json({ message: "Product deleted successfully" });
    });
});

module.exports = router;
