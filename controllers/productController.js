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
    making_charge,
    makingChargePercentage,
    total_mc,
    wastageOn,
    wastagePercentage,
    wastageWeight,
    totalWeight,
    huidNumber,
    total_price,
    product_code,
    vendor_id,
    // quantity,
    vendor_name,
    size,
  } = req.body;

  const productImage = req.files['productImage'] ? req.files['productImage'][0].filename : null;
  const videoFile = req.files['videoFile'] ? req.files['videoFile'][0].filename : null;

  // 🔹 Validate required fields
  if (!category || !subcategory || !purity || !rate ) {
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
    making_charge || 0,
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
    vendor_id,
    // quantity,
    vendor_name,
    size,
    videoFile,
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
        // ? `https://rssmjewellers.com:6001/uploads/images/${product.product_image}`
        ? `http://localhost:5000/uploads/images/${product.product_image}`
        : null,
    }));

    res.json(products);
  });
}

exports.uploadExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "❌ No file uploaded" });
  }

  const filePath = req.file.path;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (jsonData.length === 0) {
      return res.status(400).json({ error: "❌ Uploaded Excel file is empty!" });
    }

    // 🔸 Get existing product codes
    const existingProducts = await Product.getAllProductCodes();
    const existingCodes = new Set(existingProducts.map((p) => p.product_code));

    // 🔸 Filter only new rows
    const newRows = jsonData.filter(row => !existingCodes.has(row["Product Code"]));
    if (newRows.length === 0) {
      return res.status(200).json({ error: "✅ All records already exist in DB!" });
    }

    // ✅ Use vendor details from req.body
    const vendorDetails = {
      vendor_id: req.body.vendor_id || "",
      vendor_name: req.body.vendor_name || "",
      vendor_business_name: req.body.vendor_business_name || "",
      vendor_address: req.body.vendor_address || "",
      vendor_mobile: req.body.vendor_mobile || "",
      vendor_city: req.body.vendor_city || "",
      vendor_state: req.body.vendor_state || "",
      vendor_pincode: req.body.vendor_pincode || "",
    };

    const products = newRows.map(row => [
      row["Category"] || "",
      row["Subcategory"] || "",
      row["Purity"] || "",
      row["Gross Weight"] || 0,
      row["Net Wt"] || 0,
      row["HUID Number"] || "",
      row["Product Code"] || "",
      row["Size"] || "",
      row["Product Image"] || "",
      row["Video File"] || "",

      vendorDetails.vendor_id,
      vendorDetails.vendor_name,
      vendorDetails.vendor_business_name,
      vendorDetails.vendor_address,
      vendorDetails.vendor_mobile,
      vendorDetails.vendor_city,
      vendorDetails.vendor_state,
      vendorDetails.vendor_pincode,
    ]);

    Product.bulkInsert(products, (err, result) => {
      if (err) {
        console.error("❌ DB Insert Error:", err);
        return res.status(500).json({ error: "Database error while inserting data" });
      }
      res.status(201).json({ message: `✅ ${newRows.length} new products uploaded successfully!` });
    });

  } catch (error) {
    console.error("❌ Excel Upload Error:", error);
    res.status(500).json({ error: "Failed to process Excel file" });
  } finally {
    fs.unlinkSync(filePath);
  }
};

