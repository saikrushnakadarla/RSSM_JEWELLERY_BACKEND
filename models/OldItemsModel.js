const db = require("../db");

const addProduct = (product, callback) => {
  const query = `
    INSERT INTO old_items 
    (product, metal, purity, purityPercentage, hsn_code, gross, dust, ml_percent, net_wt, remarks, rate, total_amount, total_old_amount, invoiceNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    product.product,
    product.metal,
    product.purity,
    product.purityPercentage,
    product.hsn_code,
    product.gross,
    product.dust,
    product.ml_percent,
    product.net_wt,
    product.remarks,
    product.rate,
    product.total_amount,
    product.total_old_amount || 0,
    product.invoiceNumber || null,  // Corrected column name
  ];

  db.query(query, values, callback);
};

const getAllProducts = (callback) => {
  db.query("SELECT * FROM old_items", callback);
};

const getProductByInvoiceId = (invoiceId, callback) => {
  db.query(
    "SELECT * FROM old_items WHERE invoice_id = ?",
    [invoiceId],
    callback
  );
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductByInvoiceId,
};
