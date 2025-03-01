const { loginVendor } = require("../models/loginModel");

// Vendor Login Controller
const vendorLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "All fields are required!" });
  }

  loginVendor(email, password, (err, vendor) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Database error!" });
    }
    if (!vendor) {
      return res.status(401).json({ success: false, error: "Invalid email or password!" });
    }

    res.json({
      success: true,
      message: "Login successful!",
      vendor,
    });
  });
};

module.exports = { vendorLogin };
