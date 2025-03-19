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

// API to update product quantity only once per order ID
router.get("/update-quantity", (req, res) => {
  const query = `SELECT DISTINCT id, pro_id FROM orders WHERE status = 'Accepted'`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders: ", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ message: "No accepted orders found." });
    }

    // Use a Set to track processed product IDs
    const processedProducts = new Set();

    results.forEach(order => {
      if (!processedProducts.has(order.pro_id)) {
        processedProducts.add(order.pro_id);
        
        const updateQuery = `UPDATE products SET quantity = quantity - 1 WHERE id = ? AND quantity > 0`;

        db.query(updateQuery, [order.pro_id], (updateErr) => {
          if (updateErr) {
            console.error("Error updating product quantity: ", updateErr);
          }
        });
      }
    });

    res.json({ message: "Product quantities updated successfully." });
  });
});

// DELETE route to delete an order
router.delete("/orders/delete-order/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const deleteQuery = "DELETE FROM orders WHERE id = ?";

    // Use db.promise().execute() to return a proper result array
    const [result] = await db.promise().execute(deleteQuery, [orderId]);

   

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Order deleted successfully" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});



  
  

module.exports = router; 