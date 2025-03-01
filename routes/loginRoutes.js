const express = require("express");
const router = express.Router();
const { vendorLogin } = require("../controllers/loginController");

// Vendor Login Route
router.post("/vendors/login", vendorLogin);

module.exports = router;
