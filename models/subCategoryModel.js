const db = require('../db');

// Add a new subcategory
const addSubCategory = (metalType, category, subCategory, prefix, callback) => {
  const query = "INSERT INTO subcategories (metal_type, category, sub_category, prefix) VALUES (?, ?, ?, ?)";
  db.query(query, [metalType, category, subCategory, prefix], callback);
};

// Get all subcategories
const getAllSubCategories = (callback) => {
  const query = "SELECT * FROM subcategories";
  db.query(query, callback);
};

module.exports = { addSubCategory, getAllSubCategories };
