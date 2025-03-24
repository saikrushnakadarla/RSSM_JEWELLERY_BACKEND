const Vendor = require("../models/vendorModel");
const db = require("../db");
const nodemailer = require("nodemailer");

// Add Vendor
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
    res
      .status(201)
      .json({
        message: "Registered Succesfully. please wait for admin approval",
        id: result.insertId,
      });
  });
};

// Get all vendors
const getAllVendors = (req, res) => {
  Vendor.getAllVendors((err, vendors) => {
    if (err) {
      console.error("Error fetching vendors:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(vendors);
  });
};

// Vendor Login
const vendorLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required!" });
  }

  const sql = "SELECT * FROM vendors WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, error: "Database error!" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password!" });
    }

    const vendor = results[0];

    if (vendor.status !== "approved") {
      return res
        .status(403)
        .json({ success: false, error: "Your account is not approved yet!" });
    }

    res.json({
      success: true,
      message: "Login successful!",
      vendor: {
        id: vendor.id,
        email: vendor.email,
        name: vendor.vendor_name,
        role: "vendor",
      },
    });
  });
};

// Update Vendor Status
const updateVendorStatus = (req, res) => {
  const { vendorId, status } = req.body;

  if (!vendorId || !status) {
    return res
      .status(400)
      .json({ error: "Vendor ID and status are required!" });
  }

  const query = "UPDATE vendors SET status = ? WHERE id = ?";
  db.query(query, [status, vendorId], async (err, result) => {
    if (err) {
      console.error("Error updating vendor status:", err);
      return res.status(500).json({ error: "Database error!" });
    }

    if (status === "approved") {
      const vendorQuery =
        "SELECT vendor_name, email, password FROM vendors WHERE id = ?";
      db.query(vendorQuery, [vendorId], async (err, vendorResult) => {
        if (err) {
          console.error("Error fetching vendor details:", err);
          return;
        }

        if (!vendorResult || vendorResult.length === 0) {
          return res.status(404).json({ error: "Vendor not found!" });
        }

        const vendorName = vendorResult[0].vendor_name || "Vendor";
        const vendorEmail = vendorResult[0].email;
        const password = vendorResult[0].password || `${vendorName}@123`;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "solutionsitech845@gmail.com",
            pass: "yioq wuqy zofp jduj",
          },
        });

        const mailOptions = {
          from: "solutionsitech845@gmail.com",
          to: vendorEmail,
          subject: "🎉 Vendor Approval Notification",
          text: `Dear ${vendorName},\n\nYour account has been approved! 🎉\n\nLogin details:\n🔹 Email: ${vendorEmail}\n🔹 Password: ${password}\n\nThank you!`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Approval email sent to: ${vendorEmail}`);
          return res.json({ message: "Vendor status updated successfully!" });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          return res.status(500).json({ error: "Failed to send email!" });
        }
      });
    } else {
      res.json({ message: "Vendor status updated successfully!" });
    }
  });
};

// Update Vendor
const updateVendor = (req, res) => {
  const vendorId = req.params.id;
  const vendorData = req.body;

  if (!vendorId || !vendorData) {
    return res.status(400).json({ error: "Vendor ID and data are required!" });
  }

  Vendor.updateVendor(vendorId, vendorData, (err, result) => {
    if (err) {
      console.error("Error updating vendor:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Vendor updated successfully" });
  });
};

module.exports = {
  addVendor,
  getAllVendors,
  vendorLogin,
  updateVendorStatus,
  updateVendor,
};
