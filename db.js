const mysql = require("mysql2");

<<<<<<< HEAD
=======
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'ksk1005',
//     database: 'rssm_db',
//     port: 3306,
// });

>>>>>>> bcf06f577e72ef1163643b0a83a59c8eca14de20
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'ksk1005',
//     database: 'rssm_db',
//     port: 3306,
// });

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
>>>>>>> bcf06f577e72ef1163643b0a83a59c8eca14de20
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
