const Sales = require("../models/SaleModel");

exports.createSale = (req, res) => {
  const data = req.body;

  // Validate required fields
//   if (!data.mobile || !data.vendor_name ) {
//     return res.status(400).json({ error: "Required fields are missing" });
//   }

  Sales.create(data, (err, result) => {
    if (err) {
      console.error("Error inserting sale:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Sale recorded successfully", id: result.insertId });
  });
};

// Fetch all sales
exports.getAllSales = (req, res) => {
    Sales.getAll((err, results) => {
      if (err) {
        console.error("Error fetching sales data:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json(results);
    });
  };
