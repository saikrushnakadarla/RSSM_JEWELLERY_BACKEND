const Category = require("../models/categoryModel");

// Controller to add a category
const addCategory = (req, res) => {
    const { metalType, category, taxSlab, hsnCode, rBarcode } = req.body;

    // Check if at least one required field is provided
    if (!metalType && !category && !taxSlab && !hsnCode && !rBarcode) {
        return res.status(400).json({ error: "At least one field is required" });
    }

    Category.addCategory(req.body, (err, result) => {
        if (err) {
            console.error("Error inserting category:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Category added successfully", id: result.insertId });
    });
};

// Controller to fetch all categories
const getCategories = (req, res) => {
    Category.getCategories((err, results) => {
        if (err) {
            console.error("Error fetching categories:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json(results);
    });
};

module.exports = { addCategory, getCategories };
