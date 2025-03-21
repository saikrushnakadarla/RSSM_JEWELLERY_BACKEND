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

router.put("/update-product/:id", upload.single("productImage"), (req, res) => {
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
        makingCharge,
        makingChargePercentage,
        total_mc,
        wastageOn,
        wastagePercentage,
        wastageWeight,
        totalWeight,
        total_price,
        huidNumber,
        product_code,
        vendor_id,
        quantity
    } = req.body;

    // Check if a new file is uploaded
    const newImage = req.file ? req.file.filename : null;

    // Fetch existing image only if no new image is uploaded
    const getImageQuery = "SELECT product_image FROM products WHERE id = ?";
    db.query(getImageQuery, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingImage = results[0].product_image;
        const finalImage = newImage || existingImage; // Keep old image if no new one is uploaded

        // Update product details
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
                total_price = ?, 
                huid_number = ?, 
                product_code = ?, 
                product_image = ?, 
                vendor_id = ?,
                quantity=?
            WHERE id = ?`;

        const values = [
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
            makingCharge,
            makingChargePercentage,
            total_mc,
            wastageOn,
            wastagePercentage,
            wastageWeight,
            totalWeight,
            total_price,
            huidNumber,
            product_code,
            finalImage, // Use new image if uploaded, else keep existing image
            vendor_id,
            quantity,
            productId,
        ];

        db.query(updateQuery, values, (updateErr, results) => {
            if (updateErr) {
                return res.status(500).json({ error: "Database error", details: updateErr });
            }
            res.json({ message: "Product updated successfully", product_image: finalImage });
        });
    });
});



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
