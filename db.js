const mysql = require("mysql2");

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "sharvani@123",
//     database: "rssm_db",
//     port: 3307,
//   });

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Tharun@123",
//   database: "rssm_db",
//   port: 3307,
// });

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Tharun@123",
//   database: "rssm_db",
//   port: 3307,
// });

// const db = mysql.createConnection({


// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "sharvani@123",
//     database: "rssm_db",
//     port: 3307,
//   });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tharun@123",
  database: "rssm_db",
  port: 3307,
});


// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "ksk@1005",
//     database: "rssm_db",
//     port: 3306,
//   });

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "ksk1005",
//     database: "rssm_db",
//     port: 3306,
//   });

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
