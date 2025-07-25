const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// Get Available Showtimes
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT Showtime.*, Screens.screenname 
      FROM Showtime 
      INNER JOIN Screens ON Showtime.screenid = Screens.screenid
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
