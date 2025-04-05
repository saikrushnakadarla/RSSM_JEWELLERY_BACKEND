const db = require("../db");

const getLastInvoiceNumber = (callback) => {
  const query = `
    SELECT invoiceNumber 
    FROM sales 
    WHERE invoiceNumber LIKE 'INV%' 
    ORDER BY CAST(SUBSTRING(invoiceNumber, 4) AS UNSIGNED) DESC 
    LIMIT 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, [{ invoiceNumber: "INV000" }]); // Initial fallback
    }

    callback(null, results);
  });
};

module.exports = { getLastInvoiceNumber };
