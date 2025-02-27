const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/add-category", categoryController.addCategory);
router.get("/get-categories", categoryController.getCategories);

module.exports = router;
