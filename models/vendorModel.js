const db = require('../db');

const addVendor = (values, callback) => {
  const query = `
    INSERT INTO vendors (
      vendor_name, mobile, email, address, city, pincode, state, state_code, 
      bank_account_number, bank_name, ifsc_code, branch, gst_number, pan_card, aadhaar_card
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, values, callback);
};




// Function to fetch all vendors
const getAllVendors = (callback) => {
  const query = "SELECT * FROM vendors ORDER BY id DESC";
  db.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};


module.exports = { addVendor,getAllVendors};
