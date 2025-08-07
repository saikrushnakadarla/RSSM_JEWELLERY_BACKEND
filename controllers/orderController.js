const Order = require("../models/orderModel");
const nodemailer = require("nodemailer");
const db = require("../db");

// ✅ Add a new order
exports.createOrder = (req, res) => {
  const orderData = req.body;
  const productId = orderData.id;

  Order.createOrder(orderData, (err, result) => {
    if (err) {
      console.error("❌ Error inserting order:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // ✅ First fetch vendor ID from product_id
    const getVendorIdQuery = `SELECT vendor_id FROM products WHERE id = ?`;
    db.query(getVendorIdQuery, [productId], (vendorErr, vendorResults) => {
      if (vendorErr || vendorResults.length === 0) {
        console.error("❌ Error fetching vendor ID:", vendorErr || "Product not found");
        return res.status(500).json({ message: "Order placed, but vendor info missing." });
      }

      const vendorId = vendorResults[0].vendor_id;

      // ✅ Now fetch vendor email and name
      const getVendorEmailQuery = `SELECT email, vendor_name FROM vendors WHERE id = ?`;
      db.query(getVendorEmailQuery, [vendorId], async (emailErr, emailResults) => {
        if (emailErr || emailResults.length === 0) {
          console.error("❌ Error fetching vendor email:", emailErr || "Vendor not found");
          return res.status(500).json({ message: "Order placed, but failed to notify vendor." });
        }

        const vendorEmail = emailResults[0].email;
        const vendorName = emailResults[0].vendor_name;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "rssmjwellers@gmail.com",
            pass: "bmgt uugz gcbb blvo",
          },
        });

        const mailOptions = {
          from: "rssmjwellers@gmail.com",
          to: vendorEmail,
          subject: "📦 New Order Placed for Your Product!",
          text: `Dear ${vendorName},\n\nA customer has placed an order for one of your uploaded products.\n\nPlease review and process the order.\n\nBest regards,\nRSSM Jewellery Team`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`✅ Email sent to product owner (${vendorEmail})`);
        } catch (sendErr) {
          console.error("❌ Error sending email to vendor:", sendErr);
        }

        return res.status(201).json({
          message: "Order placed successfully!",
          orderId: result.insertId,
        });
      });
    });
  });
};




// ✅ Get all orders
exports.getAllOrders = (req, res) => {
  Order.getAllOrders((err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

// ✅ Get orders by Vendor ID
exports.getOrdersByVendor = (req, res) => {
  const vendorId = req.params.vendor_id;
  Order.getOrdersByVendorId(vendorId, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};
