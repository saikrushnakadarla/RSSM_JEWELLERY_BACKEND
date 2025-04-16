const db = require("../db");

const Vendor = {
  
  addVendor: (values, callback) => {
    const query = `
      INSERT INTO vendors (
        vendor_name, business_name, mobile, email, address1, address2, city, pincode,
        state, state_code, bank_account_number, bank_name, ifsc_code, branch,
        gst_number, pan_card, aadhaar_card, password, vendor_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    const query =
      "SELECT vendor_name, email, password FROM vendors WHERE id = ?";
    db.query(query, [vendorId], callback);
  },

  updateVendor: (vendorId, vendorData, callback) => {
    const {
      vendorName,
      businessName,
      mobile,
      email,
      address1,
      address2,
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
    } = vendorData;

    // Check if the password is provided or not
    const query = password
      ? `
        UPDATE vendors SET 
          vendor_name = ?, business_name=?,mobile = ?, email = ?, address1 = ?,address2 = ?, city = ?, 
          pincode = ?, state = ?, state_code = ?, bank_account_number = ?, 
          bank_name = ?, ifsc_code = ?, branch = ?, gst_number = ?, 
          pan_card = ?, aadhaar_card = ?, password = ? 
        WHERE id = ?;
      `
      : `
        UPDATE vendors SET 
          vendor_name = ?,business_name=?,mobile = ?, email = ?, address1 = ?,address2 = ?, city = ?, 
          pincode = ?, state = ?, state_code = ?, bank_account_number = ?, 
          bank_name = ?, ifsc_code = ?, branch = ?, gst_number = ?, 
          pan_card = ?, aadhaar_card = ? 
        WHERE id = ?;
      `;

    // Adjust the values array based on whether the password is included
    const values = password
      ? [
        vendorName,
        businessName,
        mobile,
        email,
        address1,
        address2,
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
          vendorId,
        ]
      : [
        vendorName,
        businessName,
        mobile,
        email,
        address1,
        address2,
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
