require('dotenv').config();
const express = require('express');
const pool = require('./event_db');

pool.getConnection()
.then(conn => {
  console.log("✅ DB Connected!");
  conn.release();
})
.catch(e => {
  console.error("❌ DB Connect Fail:", e);
})

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events");
    res.json({success:true, data:rows});
  } catch(err) {
    console.error("SQL error", err);
    res.json({success:false, message:"fetch events error"});
  }
});

app.listen(PORT, () => {
  console.log("API running on http://localhost:" + PORT);
});
