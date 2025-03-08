const db = require("../db");

const Order = {
  createOrder: (orderData, callback) => {
    const {
      category,
      subcategory,
      design_name,
      purity,
      gross_weight,
      stone_weight,
      stone_price,
      rate,
      total_amount,
      weight_before_wastage,
      making_charge,
      making_charge_percentage,
      total_mc,
      wastage_on,
      wastage_percentage,
      wastage_weight,
      total_weight,
      huid_number,
      product_image,
      total_price,
      product_code,
    } = orderData;

    const query = `
      INSERT INTO orders (
        category, subcategory, design_name, purity, gross_weight, stone_weight,
        stone_price, rate, total_amount, weight_before_wastage, making_charge,
        making_charge_percentage, total_mc, wastage_on, wastage_percentage,
        wastage_weight, total_weight, huid_number, product_image, total_price, product_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        category, subcategory, design_name, purity, gross_weight, stone_weight,
        stone_price, rate, total_amount, weight_before_wastage, making_charge,
        making_charge_percentage, total_mc, wastage_on, wastage_percentage,
        wastage_weight, total_weight, huid_number, product_image, total_price, product_code,
      ],
      callback
    );
  },

  getAllOrders: (callback) => {
    const sql = "SELECT * FROM orders";
    db.query(sql, callback);
  },

  getOrdersByVendorId: (vendor_id, callback) => {
    const sql = "SELECT * FROM orders WHERE vendor_id = ?";
    db.query(sql, [vendor_id], callback);
  },
};

module.exports = Order;
