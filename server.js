const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sharvani@123",
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

  const query = "INSERT INTO categories (metal_type, category, tax_slab, hsn_code, r_barcode) VALUES (?, ?, ?, ?, ?)";
  
  db.query(query, [metalType, category, taxSlab, hsnCode, rBarcode], (err, result) => {
      if (err) {
          console.error("Error inserting category:", err);
          return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Category added successfully", id: result.insertId });
  });
});

// GET API to fetch all categories
app.get("/get-categories", (req, res) => {
  const query = "SELECT * FROM categories";

  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching categories:", err);
          return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json(results);
  });
});

// POST API to add a subcategory
app.post("/add-subcategory", (req, res) => {
  const { metalType, category, subCategory, prefix } = req.body;

  if (!metalType || !category || !subCategory || !prefix) {
      return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO subcategories (metal_type, category, sub_category, prefix) VALUES (?, ?, ?, ?)";

  db.query(query, [metalType, category, subCategory, prefix], (err, result) => {
      if (err) {
          console.error("Error inserting subcategory:", err);
      return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "SubCategory added successfully", id: result.insertId });
  });
});

// GET API to fetch all subcategories
app.get("/get-subcategories", (req, res) => {
  const query = "SELECT * FROM subcategories";

  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching subcategories:", err);
          return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
