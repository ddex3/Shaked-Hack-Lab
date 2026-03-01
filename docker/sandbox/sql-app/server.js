const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const DB_PATH = process.env.DB_PATH || "/data/challenge.db";

function getDb() {
  return new Database(DB_PATH);
}

function initDatabase() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      email TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      category TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS secret_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flag TEXT NOT NULL,
      description TEXT
    )
  `);

  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (userCount.count === 0) {
    const insert = db.prepare("INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)");
    insert.run("admin", "sup3r_s3cur3_p4ssw0rd!", "admin", "admin@hacklab.local");
    insert.run("user1", "password123", "user", "user1@hacklab.local");
    insert.run("guest", "guest", "user", "guest@hacklab.local");
  }

  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get();
  if (productCount.count === 0) {
    const insert = db.prepare("INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)");
    insert.run("Wireless Keyboard", "Bluetooth mechanical keyboard", 79.99, "electronics");
    insert.run("USB Cable", "USB-C to USB-A cable", 9.99, "accessories");
    insert.run("Monitor Stand", "Adjustable monitor stand", 49.99, "accessories");
    insert.run("Webcam HD", "1080p HD webcam", 59.99, "electronics");
  }

  const flagCount = db.prepare("SELECT COUNT(*) as count FROM secret_data").get();
  if (flagCount.count === 0) {
    db.prepare("INSERT INTO secret_data (flag, description) VALUES (?, ?)").run(
      "FLAG{sql_1nj3ct10n_m4st3r}",
      "You found the hidden flag!"
    );
  }

  db.close();
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password required" });
  }

  const db = getDb();
  try {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const user = db.prepare(query).get();

    if (user) {
      res.json({
        success: true,
        message: "Login successful",
        user: { id: user.id, username: user.username, role: user.role, email: user.email },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error", error: err.message });
  } finally {
    db.close();
  }
});

app.get("/search", (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ success: false, message: "Search query required" });
  }

  const db = getDb();
  try {
    const query = `SELECT id, name, description, price, category FROM products WHERE name LIKE '%${q}%' OR description LIKE '%${q}%'`;
    const results = db.prepare(query).all();

    res.json({ success: true, results, count: results.length });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error", error: err.message });
  } finally {
    db.close();
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

initDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SQL sandbox running on port ${PORT}`);
});
