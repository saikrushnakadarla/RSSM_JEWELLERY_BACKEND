const express = require("express");
const router = express.Router();
const salesController = require("../controllers/SaleController");

router.post("/sales", salesController.createSale);

// GET route to fetch all sales data
router.get("/sales", salesController.getAllSales);

module.exports = router;
