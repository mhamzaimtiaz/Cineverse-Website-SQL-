const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// View All Bookings
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM Bookings`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all booking with details for a specific user
router.get('/mybookings/:id', async(req, res) => {
  const userid = req.params.id;
  try{
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userid', sql.Int, userid)
      .query(`
        SELECT 
          M.moviename,
          M.movie_mainimage_url,
          S.screenname,
          B.bookingid,
          B.booking_date,
          SH.showdate,
          SH.showtime,
          STUFF((
            SELECT ', ' + SR2.seatnumber
            FROM Seat_reservations SR1
            JOIN Seats SR2 ON SR1.seatid = SR2.seatid
            WHERE SR1.bookingid = B.bookingid
            FOR XML PATH(''), TYPE
          ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS seat_numbers,
          B.total_price
        FROM Bookings B
        JOIN Showtime SH ON B.showid = SH.showid
        JOIN Movies M ON SH.movieid = M.movieid
        JOIN Screens S ON SH.screenid = S.screenid
        WHERE B.userid = @userid;
        `);
        res.json(result.recordset);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
})

// Book a Ticket
router.post('/new', async (req, res) => {
  const { userid, showid, total_price } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userid', sql.Int, userid)
      .input('showid', sql.Int, showid)
      .input('total_price', sql.Decimal(10, 2), total_price)
      .query(`
        INSERT INTO Bookings (userid, showid, total_price) 
        VALUES (@userid, @showid, @total_price);

        SELECT SCOPE_IDENTITY() AS bookingid;
      `);
      const bookingid = result.recordset[0].bookingid;
      res.status(201).json({ bookingid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel Booking
router.delete('/:id', async (req, res) => {
  const bookingid = req.params.id;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('bookingid', sql.Int, bookingid)
      .query(`DELETE FROM Bookings WHERE bookingid = @bookingid`);
    res.json({ message: 'Booking canceled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
