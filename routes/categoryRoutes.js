const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/add-category", categoryController.addCategory);
router.get("/get-categories", categoryController.getCategories);

// Route to update a category
router.put("/update/:id", categoryController.updateCategory);

// Route to delete a category
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
