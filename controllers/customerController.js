const Customer = require("../models/customerModel");

exports.getCustomers = (req, res) => {
  console.log("✅ GET /api/customers HIT");
  Customer.getAll((err, results) => {
    if (err) {
      console.error("Error fetching customers:", err);
      return res.status(500).json({ error: "Failed to retrieve customers" });
    }
    console.log("✅ Customers from DB:", results);
    res.json(results);
  });
};

exports.createCustomer = (req, res) => {
  const customerData = req.body;

  Customer.create(customerData, (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ error: "Insert failed" });
    }

    res.status(201).json({ id: result.insertId, ...customerData });
  });
};

exports.getCustomerByName = (req, res) => {
  const { trade_name } = req.query;

  if (!trade_name) {
    return res
      .status(400)
      .json({ error: "trade_name are required" });
  }

  Customer.getByName(trade_name, (err, results) => {
    if (err) {
      console.error("Error fetching customer:", err);
      return res.status(500).json({ error: "Failed to retrieve customer" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(results[0]);
  });
};
