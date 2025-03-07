const Product = require("../models/productModel");
const XLSX = require("xlsx");
const fs = require("fs");

// ✅ Add a new product
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
    total_price,
    product_code,
  } = req.body;

  const productImage = req.file ? req.file.filename : null;

  // 🔹 Validate required fields
  if (!category || !subcategory || !designName || !purity || !grossWeight || !rate || !total_amount) {
    return res.status(400).json({ error: "All required fields must be filled!" });
  }

  const values = [
    category,
    subcategory,
    designName,
    purity,
    grossWeight,
    stoneWeight || 0,
    stonePrice || 0,
    rate,
    total_amount,
    weightBeforeWastage || 0,
    makingCharge || 0,
    makingChargePercentage || 0,
    total_mc || 0,
    wastageOn || "",
    wastagePercentage || 0,
    wastageWeight || 0,
    totalWeight || 0,
    huidNumber || "",
    productImage,
    total_price || 0,
    product_code,
  ];

  Product.addProduct(values, (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database error while adding product" });
    }
    res.status(201).json({ message: "✅ Product added successfully!", id: result.insertId });
  });
};

// ✅ Get all products
exports.getProducts = (req, res) => {
  Product.getProducts((err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database error while fetching products" });
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

// ✅ Upload Excel file and store only new data in DB
exports.uploadExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "❌ No file uploaded" });
  }

  const filePath = req.file.path;

  try {
    console.log("📂 Processing file:", filePath);

    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    console.log("📂 Parsed Excel Data:", jsonData);

    if (jsonData.length === 0) {
      return res.status(400).json({ error: "❌ Uploaded Excel file is empty!" });
    }

    // 🔹 Get existing HUIDs from database
    const existingProducts = await Product.getAllHUIDNumbers();
    const existingHUIDs = new Set(existingProducts.map((p) => p.huid_number));

    // 🔹 Filter only new products
    const newProducts = jsonData.filter((row) => !existingHUIDs.has(row["HUID Number"]));

    if (newProducts.length === 0) {
      return res.status(400).json({ error: "✅ No new products to add! All are already in the database." });
    }

    // 🔹 Prepare data for bulk insert
    const products = newProducts.map((row) => [
      row["Category"] || "",
      row["Subcategory"] || "",
      row["Design Name"] || "",
      row["Purity"] || "",
      row["Gross Weight"] || 0,
      row["Stone Weight"] || 0,
      row["Stone Price"] || 0,
      row["Rate"] || 0,
      row["Total Amount"] || 0,
      row["Weight Before Wastage"] || 0,
      row["Making Charge"] || 0,
      row["Making Charge Percentage"] || 0,
      row["Total MC"] || 0,
      row["Wastage On"] || "",
      row["Wastage Percentage"] || 0,
      row["Wastage Weight"] || 0,
      row["Total Weight"] || 0,
      row["HUID Number"] || "",
     
      null, // Placeholder for product_image
      row["Total Price"] || 0,
      row["Product Code"] || "",
    ]);

    console.log("📂 New Products for DB:", products);

    // Insert only new products
    Product.bulkInsert(products, (err, result) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ error: "Database error while uploading Excel data" });
      }
      res.status(201).json({ message: `✅ ${newProducts.length} new products uploaded successfully!` });
    });

  } catch (error) {
    console.error("❌ Error processing Excel file:", error);
    res.status(500).json({ error: "Failed to process Excel file" });
  } finally {
    // Delete file after processing
    fs.unlinkSync(filePath);
  }
};
