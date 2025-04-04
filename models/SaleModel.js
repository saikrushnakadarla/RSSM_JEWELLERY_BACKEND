const db = require("../db");

const Sales = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO sales (
        mobile, vendor_name, email, address, city, pincode, state, state_code, 
        aadhaar_card, gst_number, pan_card, date, invoiceNumber, 
        productCode, category, subcategory, purity, grossWeight, netWeight, huid, size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      data.mobile, data.vendor_name, data.email, data.address, data.city,
      data.pincode, data.state, data.state_code, data.aadhaar_card, data.gst_number,
      data.pan_card, data.date, data.invoiceNumber, data.productCode,
      data.category, data.subcategory, data.purity, data.grossWeight, data.netWeight,
      data.huid, data.size,
    ];

    db.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },


  getAll: (callback) => {
    const sql = "SELECT * FROM sales ORDER BY id DESC";
    db.query(sql, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

};

module.exports = Sales;
