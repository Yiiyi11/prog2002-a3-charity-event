/**
 * Backend API entry point for Charity Event A3
 * Node + Express REST API
 * @module app
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./event_db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * GET single event with all registrations sorted DESC by registration time
 * @route GET /api/events/:eventId
 * @param {number} eventId - event primary key
 * @returns {Promise<Object>} event + registrations array
 */
app.get('/api/events/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const [eventRows] = await pool.query(`SELECT * FROM events WHERE event_id = ?`,[eventId]);
    if(eventRows.length ===0){
      return res.json({success:false, message:"Event not found"});
    }
    const event = eventRows[0];
    // get registrations order by registration time newest first
    const [regRows] = await pool.query(`
      SELECT * FROM registrations WHERE event_id = ? ORDER BY registration_datetime DESC
    `,[eventId]);
    res.json({
      success:true,
      data:{
        event,
        registrations: regRows
      }
    })
  }catch(err){
    console.error(err);
    res.json({success:false, message:"Database error"});
  }
})

/**
 * POST create new event (admin)
 * @route POST /api/events
 */
app.post('/api/events', async (req,res)=>{
  try{
    const {event_name,description,event_datetime,location,price,target_fund,raised_fund,status,img_url,latitude,longitude,org_id,category_id} = req.body;
    const sql = `INSERT INTO events(event_name,description,event_datetime,location,price,target_fund,raised_fund,status,img_url,latitude,longitude,org_id,category_id)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const [result] = await pool.query(sql,[event_name,description,event_datetime,location,price,target_fund,raised_fund,status,img_url,latitude,longitude,org_id,category_id]);
    res.json({success:true, message:"Event created", newId: result.insertId})
  }catch(err){
    console.error(err);
    res.json({success:false, message:"Create event failed"})
  }
})

/**
 * PUT update existing event (admin)
 * @route PUT /api/events/:eventId
 */
app.put('/api/events/:eventId', async (req,res)=>{
  try{
    const eventId = req.params.eventId;
    const {event_name,description,event_datetime,location,price,target_fund,raised_fund,status,img_url,latitude,longitude,org_id,category_id} = req.body;
    const sql = `UPDATE events SET event_name=?,description=?,event_datetime=?,location=?,price=?,target_fund=?,raised_fund=?,status=?,img_url=?,latitude=?,longitude=?,org_id=?,category_id=? WHERE event_id=?`;
    await pool.query(sql,[event_name,description,event_datetime,location,price,target_fund,raised_fund,status,img_url,latitude,longitude,org_id,category_id,eventId]);
    res.json({success:true, message:"Event updated"})
  }catch(err){
    console.error(err);
    res.json({success:false, message:"Update failed"})
  }
})

/**
 * DELETE event, check if registrations exists. If exists reject delete
 * @route DELETE /api/events/:eventId
 */
app.delete('/api/events/:eventId', async (req,res)=>{
  try{
    const eventId = req.params.eventId;
    const [regRows] = await pool.query(`SELECT * FROM registrations WHERE event_id = ?`,[eventId]);
    if(regRows.length >0){
      return res.json({success:false, message:"Cannot delete, this event has existing registrations"});
    }
    await pool.query(`DELETE FROM events WHERE event_id=?`,[eventId]);
    res.json({success:true, message:"Event deleted successfully"})
  }catch(err){
    console.error(err);
    res.json({success:false, message:"Delete failed"})
  }
})

/**
 * POST new registration
 * @route POST /api/registrations
 */
app.post('/api/registrations', async (req,res)=>{
  try{
    const {event_id,contact_fullname,contact_email,contact_phone,ticket_quantity} = req.body;
    const sql = `INSERT INTO registrations(event_id,contact_fullname,contact_email,contact_phone,ticket_quantity) VALUES (?,?,?,?,?)`;
    await pool.query(sql,[event_id,contact_fullname,contact_email,contact_phone,ticket_quantity]);
    res.json({success:true, message:"Registration submitted successfully"})
  }catch(err){
    console.error(err);
    // catch unique key violation (duplicate email same event)
    if(err.code === 'ER_DUP_ENTRY'){
      return res.json({success:false, message:"This email has already registered for this event"});
    }
    res.json({success:false, message:"Registration failed"})
  }
})

// get all events for admin list
app.get('/api/events', async (req,res)=>{
  try{
    const [rows] = await pool.query(`SELECT * FROM events`);
    res.json({success:true, data:rows})
  }catch(err){
    console.error(err);
    res.json({success:false, message:"fetch events error"})
  }
})

app.listen(PORT,()=>{
  console.log(`API running on http://localhost:${PORT}`)
})
