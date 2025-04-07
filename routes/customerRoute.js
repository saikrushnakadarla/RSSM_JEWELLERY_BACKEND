const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/", customerController.getCustomers);
router.post("/", customerController.createCustomer);

// 👇 New route to get customer by mobile and name
router.get("/single", customerController.getCustomerByName);

module.exports = router;
