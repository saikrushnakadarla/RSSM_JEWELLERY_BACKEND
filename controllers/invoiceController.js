const invoiceModel = require("../models/invoiceModal");

const getLastInvoiceNumber = (req, res) => {
  invoiceModel.getLastInvoiceNumber((err, result) => {
    if (err) {
      console.error("Error fetching last invoice number:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch last invoice number" });
    }

    const lastInv = result[0]?.invoiceNumber || "INV000";
    const lastNum = parseInt(lastInv.replace("INV", ""), 10) || 0;
    const nextInv = `INV${String(lastNum + 1).padStart(3, "0")}`;

    res.json({ lastInvoiceNumber: nextInv });
  });
};

module.exports = { getLastInvoiceNumber };
