const db = require("../db");

const RateModel = {
  insertRate: (rateData, callback) => {
    const {
      rate_date,
      rate_time,
      rate_16crt,
      rate_18crt,
      rate_22crt,
      rate_24crt,
      silver_rate,
    } = rateData;

    const query = `
      INSERT INTO rates (rate_date, rate_time, rate_16crt, rate_18crt, rate_22crt, rate_24crt, silver_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    db.query(
      query,
      [
        rate_date,
        rate_time,
        rate_16crt,
        rate_18crt,
        rate_22crt,
        rate_24crt,
        silver_rate,
      ],
      callback
    );
  },

  getLatestRate: (callback) => {
    const query = "SELECT * FROM Rates ORDER BY id DESC LIMIT 1";
    db.query(query, callback);
  },
};

module.exports = RateModel;
