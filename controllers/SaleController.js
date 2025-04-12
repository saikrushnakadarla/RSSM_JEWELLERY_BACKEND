const Sales = require("../models/SaleModel");
const oldItemsModel = require("../models/OldItemsModel");

const db = require("../db");

exports.createSale = (req, res) => {
  const { vendor_info, products, oldItems } = req.body;
  let insertErrors = [];
  let productInsertCount = 0;

  // Insert each product into the sales table
  products.forEach((product) => {
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
      invoiceNumber: vendor_info.invoiceNumber, // Use the unique invoice number here
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
      amount: product.amount,
      total_amount: product.total_amount,
      huid: product.huid,
      size: product.size,
      vendor_id: vendor_info.vendor_id,
      old_gold_amount: vendor_info.old_gold_amount,
      net_payable_amount: vendor_info.net_payable_amount,
      cash_amount: vendor_info.cash_amount,
      card_amount: vendor_info.card_amount,
      cheque_amount: vendor_info.cheque_amount,
      online_amount: vendor_info.online_amount,
    };

    Sales.create(saleData, (err, result) => {
      productInsertCount++;
      if (err) {
        insertErrors.push(err);
      }

      // ✅ Update sale_status in orders table to 'sold' for matching product_code
      const updateQuery = `UPDATE orders SET sale_status = 'sold' WHERE product_code = ?`;
      db.query(updateQuery, [product.productCode], (updateErr) => {
        if (updateErr) {
          console.error(
            `Failed to update sale_status for product_code ${product.productCode}`,
            updateErr
          );
        }
      });

      // When all products have been processed...
      if (productInsertCount === products.length) {
        if (insertErrors.length > 0) {
          return res.status(500).json({
            message: "Some sales failed to insert",
            errors: insertErrors,
          });
        } else {
          // Insert old items with the same invoiceNumber
          oldItems.forEach((item) => {
            const oldItemData = {
              product: item.product,
              metal: item.metal,
              purity: item.purity,
              purityPercentage: item.purityPercentage,
              hsn_code: item.hsn_code,
              gross: item.gross,
              dust: item.dust,
              ml_percent: item.ml_percent,
              net_wt: item.net_wt,
              remarks: item.remarks,
              rate: item.rate,
              total_amount: item.total_amount,
              total_old_amount: item.total_old_amount || 0,
              // Use the invoice number from vendor_info to link with sales
              invoiceNumber: vendor_info.invoiceNumber,
            };

            oldItemsModel.addProduct(oldItemData, (err) => {
              if (err) {
                console.error("Error inserting old item:", err);
              }
            });
          });

          // Return success response with the invoiceNumber used
          return res.status(201).json({
            message: "All sales recorded successfully",
            invoiceNumber: vendor_info.invoiceNumber,
          });
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
