const ProductModel = require("../models/productModel");

// Add Product Controller
const addProduct = (req, res) => {
  // Ensure an image is uploaded
  if (!req.file) {
    return res.status(400).json({ error: "❌ Product image is required!" });
  }

  const productData = {
    ...req.body,
    productImage: req.file.path, // Store the image file path
  };

  ProductModel.addProduct(productData, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.status(201).json({ message: "✅ Product added successfully!" });
  });
};

// Get All Products Controller
const getAllProducts = (req, res) => {
  ProductModel.getAllProducts((err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.status(200).json(results);
  });
};

module.exports = {
  addProduct,
  getAllProducts,
};
