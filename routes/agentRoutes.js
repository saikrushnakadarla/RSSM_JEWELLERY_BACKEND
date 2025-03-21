const express = require("express");
const router = express.Router();
const db = require("../db"); // Import your database connection

// 📌 GET all delivery agents
router.get("/delivery-agents/get", (req, res) => {
  const sql = "SELECT * FROM delivery_agents";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching delivery agents:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
});

router.post("/delivery-agents/add", (req, res) => {
    const { name, email, mobile, vendorid,da_password } = req.body;
    
    if (!name || !email || !mobile || !vendorid || !da_password) {
      return res.status(400).json({ error: "All fields, including vendor ID, are required" });
    }
  
    const sql = "INSERT INTO delivery_agents (name, email, mobile, vendorid,da_password) VALUES (?, ?, ?, ?,?)";
    db.query(sql, [name, email, mobile, vendorid,da_password], (err, result) => {
      if (err) {
        console.error("Error adding delivery agent:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ id: result.insertId, name, email, mobile, vendorid });
    });
  });
  

// 📌 PUT (Update) an agent
router.put("/delivery-agents/update/:id", (req, res) => {
    const { name, email, mobile, vendorid } = req.body;
    const { id } = req.params;
  
    if (!name || !email || !mobile || !vendorid) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    const sql = "UPDATE delivery_agents SET name=?, email=?, mobile=?, vendorid=?  WHERE id=?";
    db.query(sql, [name, email, mobile, vendorid, id], (err) => {
      if (err) {
        console.error("Error updating delivery agent:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({ id, name, email, mobile, vendorid });
    });
  });
  
  
  // 📌 DELETE an agent
  router.delete("/delivery-agents/delete/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM delivery_agents WHERE id=?", [id], (err) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      res.status(200).json({ message: "Agent deleted successfully" });
    });
  });

module.exports = router;
