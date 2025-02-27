const SubCategory = require('../models/subCategoryModel');

// Add a new subcategory
const addSubCategory = (req, res) => {
  const { metalType, category, subCategory, prefix } = req.body;

  if (!metalType || !category || !subCategory || !prefix) {
    return res.status(400).json({ error: "All fields are required" });
  }

  SubCategory.addSubCategory(metalType, category, subCategory, prefix, (err, result) => {
    if (err) {
      console.error("Error inserting subcategory:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "SubCategory added successfully", id: result.insertId });
  });
};

// Get all subcategories
const getAllSubCategories = (req, res) => {
  SubCategory.getAllSubCategories((err, results) => {
    if (err) {
      console.error("Error fetching subcategories:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

module.exports = { addSubCategory, getAllSubCategories };
