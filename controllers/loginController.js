const { loginAdmin, loginVendor } = require("../models/loginModel");

// Admin Login Controller
const adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required!" });
  }

  loginAdmin(email, password, (err, admin) => {
    if (err)
      return res.status(500).json({ success: false, error: "Database error!" });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials!" });
    res.json({ success: true, message: "Login successful!", admin });
  });
};

// Vendor Login Controller
const vendorLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required!" });
  }

  loginVendor(email, password, (err, vendor) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Database error!" });
    }
    if (!vendor) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password!" });
    }

    res.json({
      success: true,
      message: "Login successful!",
      vendor,
    });
  });
};

module.exports = { adminLogin, vendorLogin };
