const Order = require("../models/orderModel");

// ✅ Add a new order


exports.createOrder = (req, res) => {
  const orderData = req.body; // No vendor_id

  Order.createOrder(orderData, (err, result) => {
    if (err) {
      console.error("Error inserting order:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Order placed successfully!", orderId: result.insertId });
  });
};


// ✅ Get all orders
exports.getAllOrders = (req, res) => {
  Order.getAllOrders((err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

// ✅ Get orders by Vendor ID
exports.getOrdersByVendor = (req, res) => {
  const vendorId = req.params.vendor_id;
  Order.getOrdersByVendorId(vendorId, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};
