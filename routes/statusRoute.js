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
    start_date_time,
    delivery_date_time,
    pickup_lat,
    pickup_long,
    pickup_address
  } = req.body;

  let sql;
  let values;

  if (status === "Assigned" && agent_id) {
    sql = `
      UPDATE orders 
      SET status = ?, 
          agent_id = ?, 
          agent_name = ?, 
          agent_email = ?, 
          agent_mobile = ?, 
          start_date_time = ?, 
          delivery_date_time = ?, 
          pickup_lat = ?, 
          pickup_long = ?, 
          pickup_address = ?
      WHERE id = ?
    `;
    values = [
      status,
      agent_id,
      agent_name,
      agent_email,
      agent_mobile,
      start_date_time,
      delivery_date_time,
      pickup_lat,
      pickup_long,
      pickup_address,
      id
    ];
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

router.post("/orders/update-location", async (req, res) => {
  const { order_id, latitude, longitude } = req.body;

  if (!order_id || !latitude || !longitude) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if the order status is "Received"
    const [rows] = await db.promise().query("SELECT status FROM orders WHERE id = ?", [order_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (rows[0].status === "Received") {
      return res.status(400).json({ message: "Tracking stopped. Order already received." });
    }

    // Update location if status is not "Received"
    const sql = `
      UPDATE orders 
      SET latitude = ?, longitude = ?
      WHERE id = ? AND status != 'Received'
    `;

    await db.promise().query(sql, [latitude, longitude, order_id]);

    res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/orders/get-recieved-status", async (req, res) => {
  const { order_id } = req.query;

  if (!order_id) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    const [rows] = await db.promise().query("SELECT status FROM orders WHERE id = ?", [order_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ status: rows[0].status });
  } catch (error) {
    console.error("Error fetching order status:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// API to fetch live location of a delivery agent for a specific order
router.get("/orders/get-order-location", async (req, res) => {
  try {
    const { order_id } = req.query;
    if (!order_id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Use db.promise().query() to ensure a Promise-based query
    const [rows] =  await db.promise().query(
      "SELECT latitude, longitude FROM orders WHERE id = ?",
      [order_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching order location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
  

module.exports = router; 