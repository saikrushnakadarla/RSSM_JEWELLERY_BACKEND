const db = require("../db");

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
    const query = "SELECT * FROM categories ORDER BY id DESC";

    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

// Function to update a category
const updateCategory = (id, updatedData, callback) => {
    const { metalType, category, taxSlab, hsnCode, rBarcode } = updatedData;
    const query = `
        UPDATE categories 
        SET metal_type = ?, category = ?, tax_slab = ?, hsn_code = ?, r_barcode = ? 
        WHERE id = ?
    `;

    db.query(query, [metalType, category, taxSlab, hsnCode, rBarcode, id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Function to delete a category
const deleteCategory = (id, callback) => {
    const query = "DELETE FROM categories WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
