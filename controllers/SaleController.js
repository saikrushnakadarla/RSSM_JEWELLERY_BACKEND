const Sales = require("../models/SaleModel");

exports.createSale = (req, res) => {
  const { vendor_info, products } = req.body;

  if (!vendor_info || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  let insertErrors = [];

  let insertCount = 0;

  products.forEach((product, index) => {
    const saleData = {
      ...vendor_info,
      ...product
    };

    Sales.create(saleData, (err, result) => {
      if (err) {
        insertErrors.push({ index, error: err });
      }

      insertCount++;

      // Respond when all inserts are done
      if (insertCount === products.length) {
        if (insertErrors.length > 0) {
          return res.status(500).json({
            message: "Some sales failed to insert",
            errors: insertErrors
          });
        } else {
          return res.status(201).json({ message: "All sales recorded successfully" });
        }
      }
    });
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
