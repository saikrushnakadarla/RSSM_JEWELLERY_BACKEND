const db = require("../db");

const Product = {
  addProduct: (data, callback) => {
    const query = `
      INSERT INTO products (
        category, subcategory, design_name, purity, gross_weight, 
        stone_weight, stone_price, rate, total_amount, weight_before_wastage, 
        making_charge, making_charge_percentage, total_mc, wastage_on, 
        wastage_percentage, wastage_weight, total_weight, huid_number, product_image, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, data, callback);
  },

  getProducts: (callback) => {
    const query = "SELECT * FROM products";
    db.query(query, callback);
  },

  // Bulk insert function for Excel upload
  bulkInsert: (data, callback) => {
    const query = `
      INSERT INTO products (
        category, subcategory, design_name, purity, gross_weight, 
        stone_weight, stone_price, rate, total_amount, weight_before_wastage, 
        making_charge, making_charge_percentage, total_mc, wastage_on, 
        wastage_percentage, wastage_weight, total_weight, huid_number, product_image, total_price
      ) VALUES ?`;

    db.query(query, [data], callback);
  },
};

module.exports = Product;
