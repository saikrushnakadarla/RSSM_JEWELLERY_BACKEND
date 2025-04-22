const db = require("../db"); // ✅ Ensure the database connection is used properly

const Product = {
  addProduct: (data, callback) => {
    const query = `
      INSERT INTO products (
        category, subcategory, design_name, purity, gross_weight, 
        stone_weight, stone_price, rate, total_amount, weight_before_wastage, 
        making_charge, making_charge_percentage, total_mc, wastage_on, 
        wastage_percentage, wastage_weight, total_weight, huid_number, product_image, total_price,product_code,vendor_id, vendor_name, size,vedio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)`;

    db.query(query, data, callback);
  },

  getProducts: (callback) => {
    const query = "SELECT * FROM products";
    db.query(query, callback);
  },

  getAllProductCodes: async () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT product_code FROM products", (err, results) => {
        if (err) {
          console.error("❌ Database Error in getAllProductCodes:", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  

  // ✅ Bulk insert function for Excel upload
  bulkInsert: (data, callback) => {
    const query = `
      INSERT INTO products (
        category, subcategory, purity, gross_weight, 
        weight_before_wastage, huid_number, product_code, size, 
        product_image, video_file, 
        vendor_id, vendor_name, vendor_business_name, 
        vendor_address, vendor_mobile, vendor_city, vendor_state, vendor_pincode
      ) VALUES ?
    `;
    db.query(query, [data], callback);
  },
  
};

module.exports = Product;
