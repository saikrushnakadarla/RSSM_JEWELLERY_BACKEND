const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

router.post("/add-vendor", vendorController.addVendor);
router.get("/all-vendors", vendorController.getAllVendors);
router.post("/login", vendorController.vendorLogin);
router.post("/update-status", vendorController.updateVendorStatus);
router.put("/update/:id", vendorController.updateVendor);

module.exports = router;
