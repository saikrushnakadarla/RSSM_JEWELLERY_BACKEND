const db = require("../config/db");

// Function to add a category
const addCategory = (categoryData, callback) => {
    const { metalType, category, taxSlab, hsnCode, rBarcode } = categoryData;
    const query = "INSERT INTO categories (metal_type, category, tax_slab, hsn_code, r_barcode) VALUES (?, ?, ?, ?, ?)";

    db.query(query, [metalType, category, taxSlab, hsnCode, rBarcode], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Function to get all categories
const getCategories = (callback) => {
    const query = "SELECT * FROM categories";

    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

module.exports = { addCategory, getCategories };
