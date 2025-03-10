const db = require("../db");

const Vendor = {
  addVendor: (values, callback) => {
    const query = `
      INSERT INTO vendors (
        vendor_name, mobile, email, address, city, pincode, state, state_code,
        bank_account_number, bank_name, ifsc_code, branch, gst_number, pan_card, aadhaar_card, password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, values, callback);
  },

  getAllVendors: (callback) => {
    const query = "SELECT * FROM vendors ORDER BY id DESC";
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

  updateVendorStatus: (vendorId, status, callback) => {
    const query = "UPDATE vendors SET status = ? WHERE id = ?";
    db.query(query, [status, vendorId], callback);
  },

  getVendorById: (vendorId, callback) => {
    const query = "SELECT vendor_name, email, password FROM vendors WHERE id = ?";
    db.query(query, [vendorId], callback);
  },

  updateVendor: (vendorId, vendorData, callback) => {
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
    } = vendorData;

    const query = `
      UPDATE vendors SET 
        vendor_name = ?, mobile = ?, email = ?, address = ?, city = ?, 
        pincode = ?, state = ?, state_code = ?, bank_account_number = ?, 
        bank_name = ?, ifsc_code = ?, branch = ?, gst_number = ?, 
        pan_card = ?, aadhaar_card = ? 
      WHERE id = ?;
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
      vendorId,
    ];

    db.query(query, values, callback);
  },
};

module.exports = Vendor;
