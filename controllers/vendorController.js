const Vendor = require('../models/vendorModel');

const addVendor = (req, res) => {
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
    password,
  } = req.body;

  // Validate required fields
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
    !aadhaarCard||
    !password
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

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
    password,
  ];

  Vendor.addVendor(values, (err, result) => {
    if (err) {
      console.error("Error inserting vendor:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Vendor added successfully", id: result.insertId });
  });
};




// Controller function to get all vendors
const getAllVendors = (req, res) => {
  Vendor.getAllVendors((err, vendors) => {
    if (err) {
      console.error("Error fetching vendors:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(vendors);
  });
};

module.exports = { addVendor ,getAllVendors};