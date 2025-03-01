const productModel = require('../models/ProductModel');

// Add a Product
const addProduct = (req, res) => {
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
  } = req.body;

  const productData = [
    category,
    subcategory,
    designName,
    purity,
    parseInt(grossWeight, 10),
    parseInt(stoneWeight, 10),
    parseInt(stonePrice, 10),
    parseInt(rate, 10),
    parseInt(total_amount, 10),
    parseInt(weightBeforeWastage, 10),
    makingCharge,
    parseInt(makingChargePercentage, 10),
    parseInt(total_mc, 10),
    wastageOn,
    parseInt(wastagePercentage, 10),
    parseInt(wastageWeight, 10),
    parseInt(totalWeight, 10),
    huidNumber,
  ];

  productModel.addProduct(productData, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.status(201).json({ message: '✅ Product added successfully!' });
  });
};

// Fetch All Products
const getProducts = (req, res) => {
  productModel.getAllProducts((err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.status(200).json(results);
  });
};

module.exports = { addProduct, getProducts };
