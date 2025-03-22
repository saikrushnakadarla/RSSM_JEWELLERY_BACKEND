const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");

// Routes for subcategories
router.post("/add-subcategory", subCategoryController.addSubCategory);
router.get("/get-subcategories", subCategoryController.getAllSubCategories);

// Update a subcategory
router.put("/update-subcategory/:id", subCategoryController.updateSubCategory);

// Delete a subcategory
router.delete(
  "/delete-subcategory/:id",
  subCategoryController.deleteSubCategory
);

module.exports = router;
