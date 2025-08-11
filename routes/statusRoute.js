const express = require("express");
const router = express.Router();
const db = require("../db");
const nodemailer = require("nodemailer");
// Temporary in-memory store
const otpStore = new Map();

router.put("/orders/update-status/:id", (req, res) => {
  const { id } = req.params;
  const { status, pickup_lat, pickup_long, pickup_address } = req.body;

  let sql;
  let values;

  if (status === "Accepted") {
    sql = `
      UPDATE orders 
      SET status = ?, 
          pickup_lat = ?, 
          pickup_long = ?, 
          pickup_address = ?
      WHERE id = ?
    `;
    values = [status, pickup_lat, pickup_long, pickup_address, id];
  } else {
    sql = "UPDATE orders SET status = ? WHERE id = ?";
    values = [status, id];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error updating order status:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // ✅ If order was rejected, notify customer
    if (status === "Rejected") {
      const getOrderDetailsQuery = `
        SELECT o.id, o.order_id, v.email, v.vendor_name
        FROM orders o
        JOIN vendors v ON o.order_id = v.id
        WHERE o.id = ?
      `;

      db.query(getOrderDetailsQuery, [id], async (orderErr, orderResults) => {
        if (orderErr || orderResults.length === 0) {
          console.error("❌ Failed to get customer details for rejected order:", orderErr || "Not found");
          return res.status(500).json({ message: "Order status updated, but failed to notify customer." });
        }

        const customerEmail = orderResults[0].email;
        const customerName = orderResults[0].vendor_name;

        // Setup nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "rssmjwellers@gmail.com",
            pass: "bmgt uugz gcbb blvo", // ⚠️ App password
          },
        });

        const mailOptions = {
          from: "rssmjwellers@gmail.com",
          to: customerEmail,
          subject: "❌ Order Cancelled",
          text: `Dear ${customerName},\n\nWe regret to inform you that your order has been cancelled due to certain reasons.\n\nWe apologize for the inconvenience.\n\nRegards,\nRSSM Jewellers Team`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`📩 Rejection email sent to: ${customerEmail}`);
        } catch (mailErr) {
          console.error("❌ Failed to send rejection email:", mailErr);
        }
      });
    }

    res.json({ message: "Order status updated successfully" });
  });
});



router.get("/update-quantity", async (req, res) => {
  const query = `SELECT DISTINCT id, pro_id FROM orders WHERE status = 'Accepted'`;

  db.query(query, async (err, results) => {
    if (err) {
      console.error("❌ Error fetching accepted orders:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ message: "No accepted orders found." });
    }

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rssmjwellers@gmail.com",
        pass: "bmgt uugz gcbb blvo",
      },
    });

    const processedProducts = new Set();
    const processedOrderIds = new Set();

    for (const order of results) {
      const { id: orderTableId, pro_id } = order;

      // ✅ Update product quantity once per product
      if (!processedProducts.has(pro_id)) {
        processedProducts.add(pro_id);

        const updateQuery = `UPDATE products SET quantity = quantity - 1 WHERE id = ? AND quantity > 0`;
        db.query(updateQuery, [pro_id], (updateErr) => {
          if (updateErr) {
            console.error("❌ Error updating quantity for product ID:", pro_id, updateErr);
          } else {
            console.log("✅ Quantity updated for product ID:", pro_id);
          }
        });
      }

      // ✅ Fetch order_id (vendor ID) separately using the order table ID
      const orderIdQuery = `SELECT order_id FROM orders WHERE id = ?`;
      db.query(orderIdQuery, [orderTableId], (orderIdErr, orderIdResults) => {
        if (orderIdErr || orderIdResults.length === 0) {
          console.error(`❌ Error fetching order_id for order ID: ${orderTableId}`, orderIdErr || "No result");
          return;
        }

        const order_id = orderIdResults[0].order_id;

        // ✅ Send mail only if this order_id hasn't been processed
        if (!processedOrderIds.has(order_id)) {
          processedOrderIds.add(order_id);

          const emailQuery = `SELECT email, vendor_name FROM vendors WHERE id = ?`;
          db.query(emailQuery, [order_id], async (emailErr, emailResults) => {
            if (emailErr || emailResults.length === 0) {
              console.error(`❌ Error fetching vendor email for vendor ID: ${order_id}`, emailErr || "No result");
              return;
            }

            const userEmail = emailResults[0].email;
            const userName = emailResults[0].vendor_name;

            console.log(`📩 Sending mail to vendor ID: ${order_id}, Email: ${userEmail}`);

            const mailOptions = {
              from: "rssmjwellers@gmail.com",
              to: userEmail,
              subject: "✅ Your Order Has Been Accepted!",
              text: `Dear ${userName},\n\nYour order has been accepted by the vendor. 🎉\n\nThank you for choosing our service!\n\nRegards,\nRSSM Jewellers Team`,
            };

            try {
              await transporter.sendMail(mailOptions);
              console.log(`✅ Email successfully sent to: ${userEmail}`);
            } catch (emailError) {
              console.error("❌ Error sending email to:", userEmail, emailError);
            }
          });
        } else {
          console.log(`⚠️ Skipping duplicate email for order_id: ${order_id}`);
        }
      });
    }

    return res.json({ message: "✅ Quantities updated & vendor mails sent (one per vendor)." });
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
    const [rows] = await db
      .promise()
      .query("SELECT status FROM orders WHERE id = ?", [order_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (rows[0].status === "Received") {
      return res
        .status(400)
        .json({ message: "Tracking stopped. Order already received." });
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
    const [rows] = await db
      .promise()
      .query("SELECT * FROM orders WHERE id = ?", [order_id]);

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
    const [rows] = await db
      .promise()
      .query("SELECT * FROM orders WHERE id = ?", [order_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching order location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// POST /orders/assign-agent
router.post("/orders/assign-agent", async (req, res) => {
  const {
    order_id,
    status,
    agent_id,
    agent_name,
    agent_email,
    agent_mobile,
    start_time,
    delivery_time,
  } = req.body;

  try {
    // ✅ Update order with agent details
    await db.promise().query(
      `UPDATE orders 
       SET status=?, agent_id=?, agent_name=?, agent_email=?, agent_mobile=?, 
           start_date_time=?, delivery_date_time=? 
       WHERE id=?`,
      [
        status,
        agent_id,
        agent_name,
        agent_email,
        agent_mobile,
        start_time,
        delivery_time,
        order_id,
      ]
    );

    // ✅ Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rssmjwellers@gmail.com",
        pass: "bmgt uugz gcbb blvo", // App password
      },
    });

    // ✅ Send email to agent
    const agentMailOptions = {
      from: "rssmjwellers@gmail.com",
      to: agent_email,
      subject: "📦 New Delivery Assigned to You!",
      text: `Dear ${agent_name},

You have been assigned a new delivery order.

Please check the app for full pickup and delivery details including addresses, start time, and delivery time.

Start Time: ${start_time}
Delivery Deadline: ${delivery_time}

Thank you,
RSSM Jewellers Team`,
    };

    await transporter.sendMail(agentMailOptions);
    console.log(`📩 Assignment email sent to agent: ${agent_email}`);

    // ✅ Get vendor email (owner of the product)
    const [orderRows] = await db.promise().query(
      `SELECT product_id FROM orders WHERE id = ?`,
      [order_id]
    );

    if (!orderRows.length) {
      throw new Error("Order not found");
    }

    const productOwnerId = orderRows[0].product_id;

    const [vendorRows] = await db.promise().query(
      `SELECT email, vendor_name FROM vendors WHERE id = ?`,
      [productOwnerId]
    );

    if (!vendorRows.length) {
      throw new Error("Vendor not found");
    }

    const vendorEmail = vendorRows[0].email;
    const vendorName = vendorRows[0].vendor_name;

    // ✅ Email to vendor
    const vendorMailOptions = {
      from: "rssmjwellers@gmail.com",
      to: vendorEmail,
      subject: "🚚 Your Order Has Been Assigned to a Delivery Agent",
      text: `Dear ${vendorName},

Your order has been successfully assigned to a delivery agent.

Agent Details:
Name: ${agent_name}
Email: ${agent_email}
Mobile: ${agent_mobile}

Pickup will be done on: ${start_time}
Expected Delivery Time: ${delivery_time}

Please keep the package ready for pickup.

Regards,
RSSM Jewellers Team`,
    };

    await transporter.sendMail(vendorMailOptions);
    console.log(`📩 Notification email sent to vendor: ${vendorEmail}`);

    res.status(200).json({
      message: "Order updated, emails sent to agent and vendor",
    });
  } catch (err) {
    console.error("❌ Assignment or email error:", err);
    res.status(500).json({
      message: "Failed to assign agent or send emails",
    });
  }
});



router.put("/orders/update-invoice/:id", (req, res) => {
  const orderId = req.params.id;
  const { invoice_number } = req.body;

  const query = "UPDATE orders SET invoice = ? WHERE id = ?";

  db.query(query, [invoice_number, orderId], (err, result) => {
    if (err) {
      console.error("Error updating invoice number:", err);
      return res.status(500).json({ error: "Failed to update invoice number" });
    }

    res.status(200).json({ message: "Invoice number updated successfully" });
  });
});

// GET /orders/latest-invoice/:productId
router.get("/orders/latest-invoice/:vendorId", async (req, res) => {
  const vendorId = req.params.vendorId;

  try {
    const [result] = await db.promise().query(
      `
            SELECT invoice FROM orders 
            WHERE product_id = ? AND invoice IS NOT NULL
            ORDER BY CAST(SUBSTRING(invoice, 4) AS UNSIGNED) DESC
            LIMIT 1
        `,
      [vendorId]
    );

    if (result.length > 0) {
      res.json({ latestInvoiceNumber: result[0].invoice });
    } else {
      res.json({ latestInvoiceNumber: null });
    }
  } catch (err) {
    console.error("Error fetching latest invoice:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/decrement/:productCode", async (req, res) => {
  const { productCode } = req.params;

  try {
    // Decrease quantity by 1 but only if it's greater than 0
    const [result] = await db
      .promise()
      .query(
        `UPDATE products SET quantity = quantity - 1 WHERE product_code = ? AND quantity > 0`,
        [productCode]
      );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "Product not found or quantity already 0" });
    }

    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (err) {
    console.error("Error updating product quantity:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// POST /orders/send-otp
router.post("/orders/send-otp", async (req, res) => {
  const { order_id } = req.body;

  try {
    const [rows] = await db.promise().query(`SELECT agent_email, agent_name FROM orders WHERE id = ?`, [order_id]);

    if (!rows.length) return res.status(404).json({ message: "Order not found" });

    const { agent_email, agent_name } = rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(order_id, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rssmjwellers@gmail.com",
        pass: "bmgt uugz gcbb blvo", // App password
      },
    });

    const mailOptions = {
      from: "rssmjwellers@gmail.com",
      to: agent_email,
      subject: "🔐 OTP for Order Pickup Verification",
      text: `Hello ${agent_name},

An OTP has been generated for verifying the pickup of order ID ${order_id}.

Your OTP is: ${otp}

Please share this OTP with the product owner for verification.

Thanks,
RSSM Jewellers`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});



router.post("/orders/verify-otp", async (req, res) => {
  const { order_id, otp } = req.body;

  const expectedOtp = otpStore.get(order_id);
  if (!expectedOtp) return res.status(400).json({ message: "OTP expired or not found" });

  if (expectedOtp !== otp) return res.status(401).json({ message: "Invalid OTP" });

  try {
    // ✅ Update status to Picked
    await db.promise().query(`UPDATE orders SET status = 'Picked' WHERE id = ?`, [order_id]);

    // ✅ Setup transporter once
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rssmjwellers@gmail.com",
        pass: "bmgt uugz gcbb blvo"
      }
    });

    // ✅ Get the vendor's email
    const [vendorData] = await db.promise().query(
      `SELECT v.email, v.vendor_name 
       FROM orders o 
       JOIN vendors v ON o.order_id = v.id 
       WHERE o.id = ?`,
      [order_id]
    );

    if (vendorData.length === 0) {
      return res.status(404).json({ message: "Vendor not found for this order" });
    }

    const vendorEmail = vendorData[0].email;
    const vendorName = vendorData[0].vendor_name;

    const vendorMailOptions = {
      from: "rssmjwellers@gmail.com",
      to: vendorEmail,
      subject: "Your Order Has Been Picked Up",
      html: `
        <p>Hello ${vendorName},</p>
        <p>Your order has been successfully picked up by the delivery agent and will be delivered shortly.</p>
        <p>Regards,<br/>Delivery Team</p>
      `
    };

    await transporter.sendMail(vendorMailOptions);

    // ✅ Fetch admin email
    const [adminData] = await db.promise().query(`SELECT email, name FROM admins LIMIT 1`);

    if (adminData.length > 0) {
      const adminEmail = adminData[0].email;
      const adminName = adminData[0].name;

      const adminMailOptions = {
        from: "rssmjwellers@gmail.com",
        to: adminEmail,
        subject: "🚚 Order Picked Up by Agent",
        html: `
          <p>Hello ${adminName || "Admin"},</p>
          <p>An order (ID: ${order_id}) has been picked up by the delivery agent.</p>
          <p>Please monitor its delivery status in the system.</p>
          <p>Regards,<br/>RSSM Team</p>
        `
      };

      await transporter.sendMail(adminMailOptions);
    } else {
      console.warn("⚠️ Admin email not found.");
    }

    // ✅ Cleanup OTP
    otpStore.delete(order_id);

    res.status(200).json({ message: "OTP verified, status updated, and email sent." });
  } catch (error) {
    console.error("❌ Error verifying OTP and sending email:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.post("/orders/agent-send-otp", async (req, res) => {
  const { order_id } = req.body;

  try {
    // Get vendor email and name via order → vendor relation
    const [rows] = await db.promise().query(
      `SELECT v.email, v.vendor_name
       FROM orders o
       JOIN vendors v ON o.order_id = v.id
       WHERE o.id = ?`,
      [order_id]
    );

    if (!rows.length) return res.status(404).json({ message: "Vendor not found for this order" });

    const { email, vendor_name } = rows[0];

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(order_id, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rssmjwellers@gmail.com",
        pass: "bmgt uugz gcbb blvo",
      },
    });

    const mailOptions = {
      from: "rssmjwellers@gmail.com",
      to: email,
      subject: "🔐 OTP for Order Delivery Verification",
      text: `Hello ${vendor_name},

Your order is out for delivery. Please provide this OTP to the delivery agent to receive your product.

Your OTP is: ${otp}

Thanks,
RSSM Jewellers`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to vendor email successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/orders/agent-verify-otp", async (req, res) => {
  const { order_id, otp } = req.body;

  const expectedOtp = otpStore.get(order_id);
  if (!expectedOtp) return res.status(400).json({ message: "OTP expired or not found" });
  if (expectedOtp !== otp) return res.status(401).json({ message: "Invalid OTP" });

  try {
    // ✅ Update status to Delivered
    await db.promise().query(`UPDATE orders SET status = 'Delivered' WHERE id = ?`, [order_id]);

    // ✅ Setup transporter once
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rssmjwellers@gmail.com",
        pass: "bmgt uugz gcbb blvo",
      },
    });

    // ✅ Get vendor info
    const [vendorRows] = await db.promise().query(
      `SELECT v.email, v.vendor_name 
       FROM orders o 
       JOIN vendors v ON o.order_id = v.id 
       WHERE o.id = ?`,
      [order_id]
    );

    if (vendorRows.length > 0) {
      const { email, vendor_name } = vendorRows[0];
      const mailOptions = {
        from: "rssmjwellers@gmail.com",
        to: email,
        subject: "📦 Order Delivered Successfully",
        html: `
          <p>Hello ${vendor_name},</p>
          <p>Your order has been successfully delivered. Thank you for shopping with us.</p>
          <p>Regards,<br/>RSSM Jewellers</p>
        `,
      };
      await transporter.sendMail(mailOptions);
    }

    // ✅ Send to Admin
    const [adminData] = await db.promise().query(`SELECT email, name FROM admins LIMIT 1`);
    if (adminData.length > 0) {
      const { email: adminEmail, name: adminName } = adminData[0];
      const adminMail = {
        from: "rssmjwellers@gmail.com",
        to: adminEmail,
        subject: "✅ Order Delivered",
        html: `
          <p>Hello ${adminName || "Admin"},</p>
          <p>Order ID ${order_id} has been successfully delivered to the vendor.</p>
          <p>Regards,<br/>RSSM Delivery Team</p>
        `,
      };
      await transporter.sendMail(adminMail);
    }

    // ✅ Send to Product Owner (from product_id in orders → match vendors.email)
    const [ownerData] = await db.promise().query(
      `SELECT v.email, v.vendor_name 
       FROM orders o 
       JOIN vendors v ON o.product_id = v.id 
       WHERE o.id = ?`,
      [order_id]
    );

    if (ownerData.length > 0) {
      const { email: ownerEmail, vendor_name: ownerName } = ownerData[0];
      const ownerMail = {
        from: "rssmjwellers@gmail.com",
        to: ownerEmail,
        subject: "📢 Order Delivered",
        html: `
          <p>Hello ${ownerName},</p>
          <p>The order related to your product has been successfully delivered.</p>
          <p>Regards,<br/>RSSM Platform</p>
        `,
      };
      await transporter.sendMail(ownerMail);
    }

    // ✅ Send to Delivery Agent
    const [agentData] = await db.promise().query(
      `SELECT agent_email, agent_name FROM orders WHERE id = ?`,
      [order_id]
    );

    if (agentData.length > 0) {
      const { agent_email, agent_name } = agentData[0];
      const agentMail = {
        from: "rssmjwellers@gmail.com",
        to: agent_email,
        subject: "🎉 Order Delivered Confirmation",
        html: `
          <p>Hello ${agent_name || "Agent"},</p>
          <p>You have successfully delivered order ID ${order_id}. Great job!</p>
          <p>Regards,<br/>RSSM Dispatch Team</p>
        `,
      };
      await transporter.sendMail(agentMail);
    }

    // ✅ Clean up OTP
    otpStore.delete(order_id);

    res.status(200).json({ message: "OTP verified, order delivered, emails sent to all parties." });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
