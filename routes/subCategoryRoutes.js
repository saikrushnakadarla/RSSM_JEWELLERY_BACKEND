const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

// Routes for subcategories
router.post('/add-subcategory', subCategoryController.addSubCategory);
router.get('/get-subcategories', subCategoryController.getAllSubCategories);

module.exports = router;
