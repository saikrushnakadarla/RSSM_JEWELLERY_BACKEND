// salesRoutes.js
const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// Route to get the last invoice number
router.get("/last-invoice-number", invoiceController.getLastInvoiceNumber);

module.exports = router;
