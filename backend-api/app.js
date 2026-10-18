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

// ====== 获取所有分类接口 ======
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json({success:true, data:rows});
  } catch(err){
    console.error("Category SQL error", err);
    res.json({success:false, message:"Failed to load categories"});
  }
});

// ====== 单个活动详情接口 ======
app.get('/api/events/:event_id', async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const [eventRows] = await pool.query("SELECT * FROM events WHERE event_id = ?", [event_id]);
    if (eventRows.length === 0) {
      return res.json({ success: false, message: "Event not found" });
    }
    const event = eventRows[0];
    const [regRows] = await pool.query("SELECT * FROM registrations WHERE event_id = ? ORDER BY registration_id ASC", [event_id]);
    return res.json({
      success: true,
      data: {
        event: event,
        registrations: regRows
      }
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Database error" });
  }
});

// ====== 活动搜索筛选接口（移到listen前面！！）======
app.get('/api/search-events', async (req, res) => {
  try {
    const { date, location, category_id } = req.query;
    let sql = "SELECT * FROM events WHERE 1=1";
    const params = [];
    if (date) {
      sql += " AND DATE(event_date) = ?";
      params.push(date);
    }
    if (location) {
      sql += " AND location LIKE ?";
      params.push(`%${location}%`);
    }
    if (category_id) {
      sql += " AND category_id = ?";
      params.push(category_id);
    }
    const [rows] = await pool.query(sql, params);
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (err) {
    console.error("Search error", err);
    res.json({ success: false, message: "Search failed" });
  }
});

// ========== POST注册接口 ==========
app.post('/api/register', async (req, res) => {
  try {
    const { event_id, name, email } = req.body;
    const fullname = String(name ?? "").trim();
    const contactEmail = String(email ?? "").trim();
    if (!event_id || !fullname || !contactEmail) {
      return res.json({
        success: false,
        message: "Name and Email cannot be empty, please fill in valid information."
      });
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(contactEmail)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address."
      });
    }
    const [result] = await pool.query(
      `INSERT INTO registrations (event_id, contact_fullname, contact_email, ticket_quantity, registration_datetime) VALUES (?, ?, ?, ?, NOW())`,
      [event_id, fullname, contactEmail, 1]
    );
    return res.json({
      success: true,
      message: "Registration successful",
      newRegistrationId: result.insertId
    });
  } catch (err) {
    console.error("Register SQL error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

// listen 必须放在【最后一行】
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
