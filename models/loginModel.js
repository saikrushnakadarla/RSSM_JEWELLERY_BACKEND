const db = require("../db");

// Admin Login
const loginAdmin = (email, password, callback) => {
  const sql = "SELECT * FROM admins WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);
    const admin = results[0];
    callback(null, {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: "admin",
    });
  });
};

// Vendor Login Function
const loginVendor = (email, password, callback) => {
  const sql = "SELECT * FROM vendors WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);

    const vendor = results[0];
    callback(null, {
      id: vendor.id,
      email: vendor.email,
      name: vendor.name,
      role: "vendor",
    });
  });
};

module.exports = { loginAdmin, loginVendor };
