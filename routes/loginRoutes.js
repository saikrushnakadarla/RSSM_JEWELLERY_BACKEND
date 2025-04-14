const express = require("express");
const router = express.Router();
const { adminLogin, vendorLogin } = require("../controllers/loginController");

// Vendor Login Route
router.post("/admin/login", adminLogin);
router.post("/vendors/login", vendorLogin);

module.exports = router;
