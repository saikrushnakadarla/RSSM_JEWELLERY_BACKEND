const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.post('/add-vendor', vendorController.addVendor);
router.get("/all-vendors", vendorController.getAllVendors);

module.exports = router;
