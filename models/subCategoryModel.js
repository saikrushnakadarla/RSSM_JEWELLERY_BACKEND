const db = require('../db');

// Add a new subcategory
const addSubCategory = (metalType, category, subCategory, prefix, callback) => {
  const query = "INSERT INTO subcategories (metal_type, category, sub_category, prefix) VALUES (?, ?, ?, ?)";
  db.query(query, [metalType, category, subCategory, prefix], callback);
};

// Get all subcategories
const getAllSubCategories = (callback) => {
  const query = "SELECT * FROM subcategories ORDER BY id DESC";
  db.query(query, callback);
};


// Update an existing subcategory
const updateSubCategory = (id, metalType, category, subCategory, prefix, callback) => {
  const query = "UPDATE subcategories SET metal_type = ?, category = ?, sub_category = ?, prefix = ? WHERE id = ?";
  db.query(query, [metalType, category, subCategory, prefix, id], callback);
};

// Delete a subcategory
const deleteSubCategory = (id, callback) => {
  const query = "DELETE FROM subcategories WHERE id = ?";
  db.query(query, [id], callback);
};


module.exports = { addSubCategory, getAllSubCategories, updateSubCategory,  deleteSubCategory };
