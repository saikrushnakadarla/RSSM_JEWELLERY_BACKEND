const SubCategory = require("../models/subCategoryModel");
const db = require("../db");

// Add a new subcategory
const addSubCategory = (req, res) => {
  const { metalType, category, subCategory, prefix } = req.body;

  if (!metalType || !category || !subCategory || !prefix) {
    return res.status(400).json({ error: "All fields are required" });
  }

  SubCategory.addSubCategory(
    metalType,
    category,
    subCategory,
    prefix,
    (err, result) => {
      if (err) {
        console.error("Error inserting subcategory:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const insertedId = result.insertId;

      // Fetch the full inserted row
      db.query("SELECT * FROM subcategories WHERE id = ?", [insertedId], (err, rows) => {
        if (err) {
          console.error("Error fetching inserted subcategory:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json(rows[0]); // return the full row
      });
    }
  );
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

// Update a subcategory
const updateSubCategory = (req, res) => {
  const { id } = req.params;
  const { metalType, category, subCategory, prefix } = req.body;

  if (!id) {
    return res.status(400).json({ error: "SubCategory ID is required" });
  }

  const query = `
    UPDATE subcategories 
    SET metal_type = ?, category = ?, sub_category = ?, prefix = ? 
    WHERE id = ?
  `;

  db.query(
    query,
    [metalType, category, subCategory, prefix, id],
    (err, result) => {
      if (err) {
        console.error("Error updating subcategory:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "SubCategory not found" });
      }

      // Fetch and return the updated subcategory
      db.query(
        "SELECT * FROM subcategories WHERE id = ?",
        [id],
        (err, rows) => {
          if (err) {
            console.error("Error fetching updated subcategory:", err);
            return res.status(500).json({ error: "Database error" });
          }
          res.status(200).json(rows[0]); // Return the updated row
        }
      );
    }
  );
};

// Delete a subcategory
const deleteSubCategory = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "SubCategory ID is required" });
  }

  const query = "DELETE FROM subcategories WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting subcategory:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "SubCategory not found" });
    }
    res.status(200).json({ message: "SubCategory deleted successfully" });
  });
};

module.exports = {
  addSubCategory,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
};
