const mysql = require("mysql2");

<<<<<<< HEAD
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "ksk1005",
//     database: "rssm_db",
//     port: 3306,
//   });

=======
>>>>>>> b75e043a6db6a369f39ba7a37971ac6aaf19ff25
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "ksk1005",
//     database: "rssm_db",
//     port: 3306,
//   });

const db = mysql.createConnection({
<<<<<<< HEAD
  host: "localhost",
  user: "root",
  password: "Tharun@123",
  database: "rssm_db",
  port: 3307,
});
=======
    host: "localhost",
    user: "root",
    password: "sharvani@123",
    database: "rssm_db",
    port: 3307,
  });

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Tharun@123",
//   database: "rssm_db",
//   port: 3307,
// });
>>>>>>> b75e043a6db6a369f39ba7a37971ac6aaf19ff25

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
