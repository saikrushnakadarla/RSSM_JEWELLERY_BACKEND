const express = require("express");
const router = express.Router();
const db = require("../db"); // Import your database connection

// GET Vendor by ID
router.get("/vendors/:id", (req, res) => {
  const vendorId = req.params.id;

  if (!vendorId) {
    return res.status(400).json({ error: "Vendor ID is required" });
  }

  const query = "SELECT * FROM vendors WHERE id = ?";

  db.query(query, [vendorId], (err, result) => {
    if (err) {
      console.error("❌ Error fetching vendor:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.json(result[0]); // Return the single vendor object
  });
});

router.post("/api/vendor/login", (req, res) => {
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
  
      if (vendor.status !== "approved") {
        return res
          .status(403)
          .json({ success: false, error: "Your account is not approved yet!" });
      }
  
      res.json({
        success: true,
        message: "Login successful!",
        vendor 
      });
    });
  });

  router.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
  
    const query = "SELECT * FROM vendors WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
  
      if (results.length === 0)
        return res.status(401).json({ error: "Invalid credentials" });
  
      const user = results[0];
  
      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secretKey,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
  
      res.json({ token, user });
    });
  });
  
// ✅ Delivery Agent Login Route
router.post("/api/delivery-agent/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM delivery_agents WHERE email = ? AND da_password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid email or password!" });
    }

    const agent = result[0];

    res.json({
      success: true,
      agent: {
        id: agent.id,
        email: agent.email,
        name: agent.name,
        role: "agent",
      },
    });
  });
});

//get all vendor_codes

router.get("/vendors/check-code/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM vendors WHERE vendor_code = ?", [code]);
    res.json({ exists: rows[0].count > 0 });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});


module.exports = router;
