const express = require("express");
const router = express.Router();
const db = require("../db");

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

// 📌 Add a new delivery agent
router.post("/delivery-agents/add", (req, res) => {
  const { name, email, mobile, da_password } = req.body;

  if (!name || !email || !mobile || !da_password) {
    return res
      .status(400)
      .json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO delivery_agents (name, email, mobile, da_password) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, mobile, da_password], (err, result) => {
    if (err) {
      console.error("Error adding delivery agent:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(201).json({ id: result.insertId, name, email, mobile, da_password });
  });
});

// 📌 Update a delivery agent
router.put("/delivery-agents/update/:id", (req, res) => {
  const { name, email, mobile } = req.body;
  const { id } = req.params;

  if (!name || !email || !mobile) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "UPDATE delivery_agents SET name=?, email=?, mobile=? WHERE id=?";
  db.query(sql, [name, email, mobile, id], (err) => {
    if (err) {
      console.error("Error updating delivery agent:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ id, name, email, mobile });
  });
});

// 📌 Delete a delivery agent
router.delete("/delivery-agents/delete/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM delivery_agents WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    res.status(200).json({ message: "Agent deleted successfully" });
  });
});

module.exports = router;
