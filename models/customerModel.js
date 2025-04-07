const db = require("../db");

const Customer = {
  getAll: (callback) => {
    db.query("SELECT * FROM customers", callback);
  },

  create: (data, callback) => {
    db.query("INSERT INTO customers SET ?", data, callback);
  },

  getByName: (trade_name, callback) => {
    db.query(
      "SELECT * FROM customers WHERE trade_name = ?",
      trade_name,
      callback
    );
  },

  getByMobile: (mobile, callback) => {
    db.query("SELECT * FROM customers WHERE mobile = ?", mobile, callback);
  },
};

module.exports = Customer;
