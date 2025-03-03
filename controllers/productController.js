// const ProductModel = require("../models/productModel");

// // Add Product Controller
// const addProduct = (req, res) => {
//   // Ensure an image is uploaded
//   if (!req.file) {
//     return res.status(400).json({ error: "❌ Product image is required!" });
//   }

//   const productData = {
//     ...req.body,
//     productImage: req.file.path, // Store the image file path
//   };

//   ProductModel.addProduct(productData, (err, result) => {
//     if (err) return res.status(500).json({ error: err.sqlMessage });
//     res.status(201).json({ message: "✅ Product added successfully!" });
//   });
// };

// // Get All Products Controller
// const getAllProducts = (req, res) => {
//   ProductModel.getAllProducts((err, results) => {
//     if (err) return res.status(500).json({ error: err.sqlMessage });
//     res.status(200).json(results);
//   });
// };

// module.exports = {
//   addProduct,
//   getAllProducts,
// };


const Product = require("../models/productModel");

// Add a new product
exports.addProduct = (req, res) => {
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

  const productImage = req.file ? req.file.filename : null;

  if (
    !category ||
    !subcategory ||
    !designName ||
    !purity ||
    !grossWeight ||
    !rate ||
    !total_amount
  ) {
    return res.status(400).json({ error: "All required fields must be filled!" });
  }

  const values = [
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
    productImage,
  ];

  Product.addProduct(values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Database error while adding product" });
    }
    res.status(201).json({ message: "Product added successfully!", id: result.insertId });
  });
};

// Get all products
exports.getProducts = (req, res) => {
  Product.getProducts((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const products = results.map((product) => ({
      ...product,
      product_image: product.product_image
        ? `http://localhost:5000/uploads/images/${product.product_image}`
        : null,
    }));

    res.json(products);
  });
};
