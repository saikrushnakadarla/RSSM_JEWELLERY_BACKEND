const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000; 

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ksk1005',
    database: 'rssm_db',
    port: 3307,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully!" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
