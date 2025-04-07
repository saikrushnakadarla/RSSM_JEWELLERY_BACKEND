const Sales = require("../models/SaleModel");

exports.createSale = (req, res) => {
  const { vendor_info, products } = req.body;

  
console.log('Vendor Info:', JSON.stringify(vendor_info, null, 2));
console.log('Products:', JSON.stringify(products, null, 2));



  // if (!vendor_info || !Array.isArray(products) || products.length === 0) {
  //   return res.status(400).json({ error: "Invalid payload" });
  // }

  const validMcTypes = ['Mc per gram', 'Piece cost']; // Define valid ENUM values
  let insertErrors = [];
  let insertCount = 0;

  products.forEach((product, index) => {
    // Validate mc_type
    // if (!validMcTypes.includes(product.mc_type)) {
    //   insertErrors.push({ index, error: `Invalid mc_type value: ${product.mc_type}` });
    //   insertCount++;
    //   return; // Skip this product
    // }

    const saleData = {
      mobile: vendor_info.mobile,
      vendor_name: vendor_info.vendor_name,
      email: vendor_info.email,
      address: vendor_info.address,
      city: vendor_info.city,
      pincode: vendor_info.pincode,
      state: vendor_info.state,
      state_code: vendor_info.state_code,
      aadhaar_card: vendor_info.aadhaar_card,
      gst_number: vendor_info.gst_number,
      pan_card: vendor_info.pan_card,
      date: vendor_info.date,
      invoiceNumber: vendor_info.invoiceNumber,
      productCode: product.productCode,
      category: product.category,
      subcategory: product.subcategory,
      purity: product.purity,
      grossWeight: product.grossWeight,
      netWeight: product.netWeight,
      mc_type: product.mc_type,
      mc_per_gram: product.mc_per_gram,
      total_mc: product.total_mc,
      rate: product.rate,
      total_amount: product.total_amount,
      huid: product.huid,
      size: product.size,
      vendor_id: vendor_info.vendor_id,
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
            errors: insertErrors,
          });
        } else {
          return res
            .status(201)
            .json({ message: "All sales recorded successfully" });
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

// Get Single Sale by ID
exports.getSaleById = (req, res) => {
  const { id } = req.params;

  Sales.getById(id, (err, result) => {
    if (err) {
      console.error("Error fetching sale:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!result) return res.status(404).json({ error: "Sale not found" });

    res.status(200).json(result);
  });
};

// Update Sale by ID
exports.updateSale = (req, res) => {
  const { id } = req.params;
  const saleData = { ...req.body };

  // Convert ISO string to 'YYYY-MM-DD' if date exists
  if (saleData.date) {
    saleData.date = new Date(saleData.date).toISOString().split("T")[0]; // 👈 Format to 'YYYY-MM-DD'
  }

  Sales.updateById(id, saleData, (err, result) => {
    if (err) {
      console.error("Error updating sale:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sale not found" });
    }

    res.status(200).json({ message: "Sale updated successfully" });
  });
};

// Delete Sale by ID
exports.deleteSale = (req, res) => {
  const { id } = req.params;

  Sales.deleteById(id, (err, result) => {
    if (err) {
      console.error("Error deleting sale:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sale not found" });
    }

    res.status(200).json({ message: "Sale deleted successfully" });
  });
};
