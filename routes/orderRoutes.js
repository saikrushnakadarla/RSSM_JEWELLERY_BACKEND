const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/add-order", orderController.createOrder);
router.get("/get-orders", orderController.getAllOrders);
router.get("/get-orders/:vendor_id", orderController.getOrdersByVendor);

module.exports = router;
