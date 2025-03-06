const RateModel = require("../models/rateModel");

const RateController = {
  postRates: (req, res) => {
    try {
      const { rate_date, rate_time, rate_16crt, rate_18crt, rate_22crt, rate_24crt, silver_rate } = req.body;

      console.log("Received Data:", req.body);

      if (!rate_date || !rate_22crt || !silver_rate) {
        return res.status(400).json({ error: "Required fields: rate_date, rate_22crt, silver_rate" });
      }

      const newRate = {
        rate_date,
        rate_time: rate_time || new Date().toLocaleTimeString("en-GB"),
        rate_16crt: rate_16crt || null,
        rate_18crt: rate_18crt || null,
        rate_22crt,
        rate_24crt: rate_24crt || null,
        silver_rate
      };

      RateModel.insertRate(newRate, (err, result) => {
        if (err) {
          console.error("MySQL Error:", err);
          return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.status(201).json({ message: "Rates updated successfully!", id: result.insertId });
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getCurrentRates: (req, res) => {
    RateModel.getLatestRate((err, results) => {
      if (err) {
        console.error("Error fetching rates:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!results || results.length === 0) {
        return res.status(404).json({ error: "No rates found" });
      }
      res.json(results[0]);
    });
  }
};

module.exports = RateController;
