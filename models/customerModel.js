const db = require("../db");

const Customer = {
  getAll: (callback) => {
    db.query("SELECT * FROM customers", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM customers WHERE id = ?", [id], (err, results) => {
      if (err || results.length === 0)
        return callback(err || new Error("Not Found"));
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    db.query("INSERT INTO customers SET ?", data, callback);
  },

  // Change your getByName and getByMobile to this:
  getByName: (trade_name, callback) => {
    db.query(
      "SELECT * FROM customers WHERE LOWER(TRIM(trade_name)) = LOWER(TRIM(?))",
      [trade_name],
      callback
    );
  },

  getByMobile: (mobile, callback) => {
    db.query(
      "SELECT * FROM customers WHERE TRIM(mobile) = TRIM(?)",
      [mobile],
      callback
    );
  },

  update: (id, data, callback) => {
    db.query("UPDATE customers SET ? WHERE id = ?", [data, id], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM customers WHERE id = ?", [id], callback);
  },
};

module.exports = Customer;
