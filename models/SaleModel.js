const db = require("../db");

const Sales = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO sales (
        mobile, vendor_name, email, address, city, pincode, state, state_code, 
        aadhaar_card, gst_number, pan_card, date, invoiceNumber, 
        productCode, category, subcategory, purity, grossWeight, netWeight,
        mc_type, mc_per_gram, total_mc, rate, total_amount,
        huid, size, vendor_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.mobile,
      data.vendor_name,
      data.email,
      data.address,
      data.city,
      data.pincode,
      data.state,
      data.state_code,
      data.aadhaar_card,
      data.gst_number,
      data.pan_card,
      data.date,
      data.invoiceNumber,
      data.productCode,
      data.category,
      data.subcategory,
      data.purity,
      data.grossWeight,
      data.netWeight,
      data.mc_type,
      data.mc_per_gram,
      data.total_mc,
      data.rate,
      data.total_amount,
      data.huid,
      data.size,
      data.vendor_id,
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

  getById: (id, callback) => {
    const sql = "SELECT * FROM sales WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result[0]);
    });
  },

  updateById: (id, data, callback) => {
    const sql = `
      UPDATE sales SET 
        mobile = ?, vendor_name = ?, email = ?, address = ?, city = ?, pincode = ?, state = ?, state_code = ?, 
        aadhaar_card = ?, gst_number = ?, pan_card = ?, date = ?, invoiceNumber = ?, 
        productCode = ?, category = ?, subcategory = ?, purity = ?, grossWeight = ?, netWeight = ?,
        mc_type = ?, mc_per_gram = ?, total_mc = ?, rate = ?, total_amount = ?,
        huid = ?, size = ?
      WHERE id = ?
    `;

    const values = [
      data.mobile,
      data.vendor_name,
      data.email,
      data.address,
      data.city,
      data.pincode,
      data.state,
      data.state_code,
      data.aadhaar_card,
      data.gst_number,
      data.pan_card,
      data.date,
      data.invoiceNumber,
      data.productCode,
      data.category,
      data.subcategory,
      data.purity,
      data.grossWeight,
      data.netWeight,
      data.mc_type,
      data.mc_per_gram,
      data.total_mc,
      data.rate,
      data.total_amount,
      data.huid,
      data.size,
      id,
    ];

    db.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  deleteById: (id, callback) => {
    const sql = "DELETE FROM sales WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
};

module.exports = Sales;
