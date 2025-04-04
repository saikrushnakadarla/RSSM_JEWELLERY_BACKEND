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
      vendor_id,
      order_id,
      id,
      ordered_vendor,
      vendor_name,
      delivery_lat,
      delivery_long,
      delivery_address
    } = orderData;
  
    const query = `
      INSERT INTO orders (
        category, subcategory, design_name, purity, gross_weight, stone_weight,
        stone_price, rate, total_amount, weight_before_wastage, making_charge,
        making_charge_percentage, total_mc, wastage_on, wastage_percentage,
        wastage_weight, total_weight, huid_number, product_image, total_price, product_code,
        product_id, order_id, pro_id, ordered_vendor, vendor_product,
        delivery_lat, delivery_long, delivery_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      query,
      [
        category, subcategory, design_name, purity, gross_weight, stone_weight,
        stone_price, rate, total_amount, weight_before_wastage, making_charge,
        making_charge_percentage, total_mc, wastage_on, wastage_percentage,
        wastage_weight, total_weight, huid_number, product_image, total_price, product_code,
        vendor_id, order_id, id, ordered_vendor, vendor_name,
        delivery_lat, delivery_long, delivery_address
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
