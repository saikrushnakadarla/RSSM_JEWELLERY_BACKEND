const express = require("express");
const router = express.Router();
const salesController = require("../controllers/SaleController");

router.post("/sales", salesController.createSale);

// GET route to fetch all sales data
router.get("/sales", salesController.getAllSales);

// Get single sale
router.get("/:id", salesController.getSaleById);

// Update sale
router.put("/:id", salesController.updateSale);

// Delete sale
router.delete("/:id", salesController.deleteSale);

module.exports = router;
