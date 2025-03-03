const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;
// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for storing images in the folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/"); // Save images in uploads/images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tharun@123",
  database: "rssm_db",
  port: 3307,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// POST API to add a category
app.post("/add-category", (req, res) => {
  const { metalType, category, taxSlab, hsnCode, rBarcode } = req.body;

  if (!metalType || !category || !taxSlab || !hsnCode || !rBarcode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query =
    "INSERT INTO categories (metal_type, category, tax_slab, hsn_code, r_barcode) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [metalType, category, taxSlab, hsnCode, rBarcode],
    (err, result) => {
      if (err) {
        console.error("Error inserting category:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res
        .status(201)
        .json({ message: "Category added successfully", id: result.insertId });
    }
  );
});

// GET API to fetch all categories
app.get("/get-categories", (req, res) => {
  const query = "SELECT * FROM categories ORDER BY id DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// POST API to add a subcategory
app.post("/subcategories/add-subcategory", (req, res) => {
  const { metalType, category, subCategory, prefix } = req.body;

  if (!metalType || !category || !subCategory || !prefix) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query =
    "INSERT INTO subcategories (metal_type, category, sub_category, prefix) VALUES (?, ?, ?, ?)";

  db.query(query, [metalType, category, subCategory, prefix], (err, result) => {
    if (err) {
      console.error("Error inserting subcategory:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(201)
      .json({ message: "SubCategory added successfully", id: result.insertId });
  });
});

// GET API to fetch all subcategories
app.get("/subcategories/get-subcategories", (req, res) => {
  const query = "SELECT * FROM subcategories ORDER BY id DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching subcategories:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});
app.post("/vendors/add-vendor", (req, res) => {
  const {
    vendorName,
    mobile,
    email,
    address,
    city,
    pincode,
    state,
    stateCode,
    bankAccountNumber,
    bankName,
    ifscCode,
    branch,
    gstNumber,
    panCard,
    aadhaarCard,
    password, // ✅ Include password
  } = req.body;

  if (
    !vendorName ||
    !mobile ||
    !email ||
    !address ||
    !city ||
    !pincode ||
    !state ||
    !stateCode ||
    !bankAccountNumber ||
    !bankName ||
    !ifscCode ||
    !branch ||
    !gstNumber ||
    !panCard ||
    !aadhaarCard ||
    !password // ✅ Ensure password is checked
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // ✅ Fixed SQL Query: Removed double quotes around INSERT statement
  const query = `
    INSERT INTO vendors (
      vendor_name, mobile, email, address, city, pincode, state, state_code, 
      bank_account_number, bank_name, ifsc_code, branch, gst_number, pan_card, aadhaar_card, password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const values = [
    vendorName,
    mobile,
    email,
    address,
    city,
    pincode,
    state,
    stateCode,
    bankAccountNumber,
    bankName,
    ifscCode,
    branch,
    gstNumber,
    panCard,
    aadhaarCard,
    password, // ✅ Ensure password is included
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Error inserting vendor:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(201)
      .json({ message: "✅ Vendor added successfully", id: result.insertId });
  });
});

// Fetch all vendors
app.get("/vendors/all-vendors", (req, res) => {
  const query = "SELECT * FROM vendors ORDER BY id DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching vendors:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// 🟢 Vendor Login API (Without JWT)
app.post("/api/vendors/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required!" });
  }

  const sql = "SELECT * FROM vendors WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Database error!" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password!" });
    }

    const vendor = results[0];

    res.json({
      success: true,
      message: "Login successful!",
      vendor: {
        id: vendor.id,
        email: vendor.email,
        name: vendor.name,
        role: "vendor",
      },
    });
  });
});

// Filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg formats are allowed!"));
  }
};

// Serve Static Images
app.use("/uploads/images", express.static("uploads/images"));

// Add Product API with Image Handling

const upload = multer({ storage: storage });

app.post("/products/add-product", upload.single("productImage"), (req, res) => {
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

  // Get the filename instead of storing the whole image as BLOB
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
    return res
      .status(400)
      .json({ error: "All required fields must be filled!" });
  }

  const query = `
    INSERT INTO products (
      category, subcategory, design_name, purity, gross_weight, 
      stone_weight, stone_price, rate, total_amount, weight_before_wastage, 
      making_charge, making_charge_percentage, total_mc, wastage_on, 
      wastage_percentage, wastage_weight, total_weight, huid_number, product_image
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

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
    productImage, // ✅ Save filename instead of binary
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Database error while adding product" });
    }
    res
      .status(201)
      .json({ message: "Product added successfully!", id: result.insertId });
  });
});

app.get("/products/get-products", (req, res) => {
  const sql =
    "SELECT id, category, subcategory, design_name, purity, gross_weight, product_image FROM products";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Convert stored filename into a URL
    const products = results.map((product) => ({
      ...product,
      product_image: product.product_image
        ? `http://localhost:5000/uploads/images/${product.product_image}`
        : null, // Return null if no image
    }));

    res.json(products);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
