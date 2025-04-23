const Customer = require("../models/customerModel");
const db = require("../db"); // Adjust the path if needed

exports.getCustomers = (req, res) => {
  const vendorId = req.query.vendor_id;

  Customer.getByVendorId(vendorId, (err, results) => {
    if (err)
      return res.status(500).json({ error: "Failed to retrieve customers" });
    res.json(results);
  });
};

exports.createCustomer = (req, res) => {
  const customerData = req.body;
  const vendorId = req.body.vendor_id; // Ensure vendor_id is passed

  if (!vendorId) {
    return res.status(400).json({ error: "Vendor ID is required" });
  }

  customerData.vendor_id = vendorId;

  Customer.create(customerData, (err, result) => {
    if (err) return res.status(500).json({ error: "Insert failed" });
    res.status(201).json({ id: result.insertId, ...customerData });
  });
};

exports.getCustomerById = (req, res) => {
  const { id } = req.params;
  const { vendor_id } = req.query;
  Customer.getById(id, vendor_id, (err, customer) => {
    if (err || !customer)
      return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  });
};

exports.getCustomerByName = (req, res) => {
  let { trade_name, mobile } = req.query;

  trade_name = trade_name?.trim();
  mobile = mobile?.trim();

  console.log("🔍 Received query:", { trade_name, mobile });

  if (!trade_name && !mobile) {
    return res
      .status(400)
      .json({ error: "Either trade_name or mobile is required" });
  }

  const callback = (err, results) => {
    if (err) {
      console.error("❌ Error fetching customer:", err);
      return res.status(500).json({ error: "Failed to retrieve customer" });
    }

    console.log("📦 Query results:", results);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(results[0]);
  };

  // 🆕 Search with both if available
  if (trade_name && mobile) {
    db.query(
      "SELECT * FROM customers WHERE TRIM(trade_name) = ? AND TRIM(mobile) = ?",
      [trade_name, mobile],
      callback
    );
  } else if (trade_name) {
    Customer.getByName(trade_name, callback);
  } else {
    Customer.getByMobile(mobile, callback);
  }
};

exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  console.log("Received update for customer:", id, updatedData); // Debug log

  if (updatedData.vendor_id) {
    console.warn("Warning: vendor_id in update data, removing.");
    delete updatedData.vendor_id;
  }

  db.query("SELECT * FROM customers WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Add this line
      return res.status(500).json({ error: "Error fetching customer" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    Customer.update(id, updatedData, (err, result) => {
      if (err) {
        console.error("Update error:", err); // Add this line
        return res.status(500).json({ error: "Update failed" });
      }
      res.json({ message: "Customer updated successfully" });
    });
  });
};

exports.deleteCustomer = (req, res) => {
  const { id } = req.params;
  Customer.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Customer deleted successfully" });
  });
};
