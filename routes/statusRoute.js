const express = require("express");
const router = express.Router();
const db = require("../db");

router.put("/orders/update-status/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    
    db.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ message: "Database error" });
      } else {
        res.json({ message: "Order status updated successfully" });
      }
    });
  });

  
  
  

module.exports = router; 