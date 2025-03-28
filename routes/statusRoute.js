const express = require("express");
const router = express.Router();
const db = require("../db");

router.put("/orders/update-status/:id", (req, res) => {
  const { id } = req.params;
  const { 
    status, 
    agent_id, 
    agent_name, 
    agent_email, 
    agent_mobile, 
    start_date_time,  // New field
    delivery_date_time // New field
  } = req.body;

  let sql;
  let values;

  if (status === "Assigned" && agent_id) {
      sql = `
        UPDATE orders 
        SET status = ?, agent_id = ?, agent_name = ?, agent_email = ?, 
            agent_mobile = ?, start_date_time = ?, delivery_date_time = ? 
        WHERE id = ?
      `;
      values = [status, agent_id, agent_name, agent_email, agent_mobile, start_date_time, delivery_date_time, id];
  } else {
      sql = "UPDATE orders SET status = ? WHERE id = ?";
      values = [status, id];
  }

  db.query(sql, values, (err, result) => {
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


// Get assigned orders for the logged-in agent
router.get("/orders/get-agent-orders", async (req, res) => {
  try {
    const { agent_id } = req.query; // Get agent_id from query parameters

    if (!agent_id) {
      return res.status(400).json({ error: "Agent ID is required" });
    }

    // Fetch orders where agent_id matches the logged-in user
    const query = "SELECT * FROM orders WHERE agent_id = ?";
    db.query(query, [agent_id], (err, results) => {
      if (err) {
        console.error("Error fetching agent orders:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update delivery agent's live location
router.post("/orders/update-location", async (req, res) => {
  const { agent_id, latitude, longitude } = req.body;

  if (!agent_id || !latitude || !longitude) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const sql = `
      UPDATE orders 
      SET latitude = ?, longitude = ?
      WHERE agent_id = ? AND status = 'Assigned'
    `;

    await db.promise().query(sql, [latitude, longitude, agent_id]);

    res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Server error" });
  }
});


  

module.exports = router; 