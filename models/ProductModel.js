const db = require('../db/db');

const addProduct = (productData, callback) => {
  const sql = `
    INSERT INTO producttable 
    (category, subcategory, productdesign, purity, grossweight, stoneweight, stoneprice, rate, 
    total_rate_before_mc, weightbeforewastage, mc_on, mc_percentage, total_mc_weight_after_mc_percentage, 
    wastage_on, wastage_percentage, wastage_weight, total_weight, huid_number) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(sql, productData, (err, result) => {
    callback(err, result);
  });
};

const getAllProducts = (callback) => {
  db.query('SELECT * FROM producttable', (err, results) => {
    callback(err, results);
  });
};

module.exports = { addProduct, getAllProducts };
