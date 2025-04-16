const Category = require("../models/categoryModel");

// Controller to add a category
const addCategory = (req, res) => {
    const { metalType, category, taxSlab, hsnCode, rBarcode } = req.body;

    // Check if at least one required fieldy is provided
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

// Controller to update a category
const updateCategory = (req, res) => {
    const categoryId = req.params.id;
    const updatedData = req.body;

    if (!categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
    }

    Category.updateCategory(categoryId, updatedData, (err, result) => {
        if (err) {
            console.error("Error updating category:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: "Category updated successfully" });
    });
};

// Controller to delete a category
const deleteCategory = (req, res) => {
    const categoryId = req.params.id;

    if (!categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
    }

    Category.deleteCategory(categoryId, (err, result) => {
        if (err) {
            console.error("Error deleting category:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    });
};


module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
