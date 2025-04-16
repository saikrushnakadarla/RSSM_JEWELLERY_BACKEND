const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/", customerController.getCustomers);
router.post("/", customerController.createCustomer);

// 👇 New route to get customer by mobile and name
router.get("/:id", customerController.getCustomerById);
router.get("/single", customerController.getCustomerByName);

router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
