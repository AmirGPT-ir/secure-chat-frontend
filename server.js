const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'services.irn3.chabokan.net', 
    database: 'anthony',
    password: 'kCu1QWZtGZeOExqC',
    port: 34341,
    ssl: false 
});


app.get("/", (req, res) => {
  res.send("Secure chat backend running");
});

app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM secure_messages ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.post("/send", async (req, res) => {
  const { sender, content } = req.body;

  try {
    await pool.query(
      "INSERT INTO secure_messages(sender,content) VALUES($1,$2)",
      [sender, content]
    );
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server started");
});
