const db = require("../db");

// Add Product
const addProduct = (productData, callback) => {
  const {
    category,
    subcategory,
    designName,
    purity,
    grossWeight,
    stoneWeight,
    stonePrice,
    rate,
    total_amount,
    weightBeforeWastage,
    makingCharge,
    makingChargePercentage,
    total_mc,
    wastageOn,
    wastagePercentage,
    wastageWeight,
    totalWeight,
    huidNumber,
    productImage, // New Field for Image
  } = productData;

  const sql = `
    INSERT INTO producttable 
    (category, subcategory, productdesign, purity, grossweight, stoneweight, stoneprice, rate, 
    total_rate_before_mc, weightbeforewastage, mc_on, mc_percentage, total_mc_weight_after_mc_percentage, 
    wastage_on, wastage_percentage, wastage_weight, total_weight, huid_number, product_image) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      category,
      subcategory,
      designName,
      purity,
      grossWeight, 
     stoneWeight, 
     stonePrice, 
      rate, 
      total_amount, 
      weightBeforeWastage, 
      makingCharge,
      makingChargePercentage, 
      total_mc, 
      wastageOn,
      wastagePercentage, 
      wastageWeight, 
      totalWeight,
      huidNumber,
      productImage, // Storing Image Path
    ],
    callback
  );
};

// Fetch All Products
const getAllProducts = (callback) => {
  db.query("SELECT * FROM producttable", callback);
};

module.exports = {
  addProduct,
  getAllProducts,
};
