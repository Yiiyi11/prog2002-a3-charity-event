/**
 * Database connection module for charity event system
 * Uses mysql2 promise based connection pool
 * @module event_db
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

/**
 * Create mysql connection pool
 * @returns {mysql.Pool} mysql connection pool
 */
function createPool(){
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:10
  })
}
const pool = createPool();
module.exports = pool;
