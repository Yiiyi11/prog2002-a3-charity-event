/*
 * File: app.js
 * Backend RESTful API for Charity Events Website (PROG2002 A3)
 * Technology: Node.js + Express + MySQL connection pool
 * Main functions:
 *  - Retrieve events, categories, event detail with registrations
 *  - Event keyword/date/category search
 *  - User event registration
 *  - Proxy for open‑meteo external weather API
 * Business Notes:
 *  - Registration: currently ticket_quantity hard‑coded to 1
 *  - Registrations sorting: ORDER BY registration_id ASC (oldest first)
 */
require('dotenv').config();
const express = require('express');
const pool = require('./event_db');

// Test database connection on server startup
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

// Global middleware
app.use(cors()); // allow cross‑origin requests from angular frontend
app.use(express.json()); // parse incoming json request body

/**
 * GET /api/events
 * Fetch all charity events from database
 * Return list of event objects inside data field
 */
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events");
    res.json({success:true, data:rows});
  } catch(err) {
    console.error("SQL error", err);
    res.json({success:false, message:"fetch events error"});
  }
});

/**
 * GET /api/categories
 * Get all event categories
 */
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json({success:true, data:rows});
  } catch(err){
    console.error("Category SQL error", err);
    res.json({success:false, message:"Failed to load categories"});
  }
});

/**
 * GET /api/events/:event_id
 * Get single event details + its related registration records
 * Path param: event_id — target event primary key
 * Return event info + registrations array
 * Note: registrations ordered ASC (oldest registration first)
 */
app.get('/api/events/:event_id', async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const [eventRows] = await pool.query("SELECT * FROM events WHERE event_id = ?", [event_id]);
    // Return business error when event record not found
    if (eventRows.length === 0) {
      return res.json({ success: false, message: "Event not found" });
    }
    const event = eventRows[0];
    // Fetch all registrations belong to this event
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

/**
 * GET /api/search-events
 * Filter events by date, location keyword, category_id
 * Query params: date, location, category_id (all optional)
 * Build dynamic SQL with safe parameterised query
 */
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
  } catch(err) {
    console.error("Search error", err);
    res.json({ success: false, message: "Search failed" });
  }
});

/**
 * GET /api/weather
 * Proxy endpoint for open‑meteo external weather API
 * Query params: lat, lng — latitude and longitude numbers
 * Note: response format inconsistent with other api endpoints
 */
app.get('/api/weather', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return res.json({ error: "No coordinates" });
    }
    const url = `https://api.open‑meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    const resp = await fetch(url);
    const apiData = await resp.json();
    res.json({
      temp: apiData.current_weather.temperature,
      weatherCode: apiData.current_weather.weathercode
    });
  } catch (err) {
    console.error("Weather API error:", err);
    res.status(500).json({ error: "Failed to get weather" });
  }
});

/**
 * POST /api/register
 * Handle user registration for selected charity event
 * Request body: event_id, name, email
 * Validates non‑empty value and email format
 * Note: ticket_quantity currently hard‑coded as value 1
 */
app.post('/api/register', async (req, res) => {
  try {
    const { event_id, name, email } = req.body;
    const fullname = String(name ?? "").trim();
    const contactEmail = String(email ?? "").trim();
    // Required field validation
    if (!event_id || !fullname || !contactEmail) {
      return res.json({
        success: false,
        message: "Name and Email cannot be empty, please fill in valid information."
      });
    }
    // Email format regex validation
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(contactEmail)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address."
      });
    }
    // Insert new registration record into database
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

// Server start listener, must stay at end of file
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
