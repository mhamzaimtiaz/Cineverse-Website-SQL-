const express = require("express");
const { sql, poolPromise } = require('../db');
const router = express.Router();

// Get all seats
router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Seats");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get seatid, seatnumber and availability for a show
router.get('/seatsavailability/:showid', async (req, res) => {
    const showid = req.params.showid;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("showid", sql.Int, showid)
            .query(`
            SELECT 
                s.seatid,
                s.seatnumber,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM Seat_reservations sr
                        JOIN Bookings b ON sr.bookingid = b.bookingid
                        WHERE sr.seatid = s.seatid AND b.showid = @showid
                    ) THEN 'booked'
                    ELSE 'available'
                END AS Availability
            FROM Seats s
            JOIN Showtime st ON s.screenid = st.screenid
            WHERE st.showid = @showid
            ORDER BY seatid;
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get ticketprice and no. of available seats for a show
router.get('/availseatsandprice/:showid', async (req, res) => {
    const showid = req.params.showid;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("showid", sql.Int, showid)
            .query(`
        SELECT 
            s.ticketprice, 
            COUNT(se.seatid) AS availseats
        FROM Showtime s
        JOIN Seats se ON s.screenid = se.screenid
        WHERE s.showid = @showid
        AND NOT EXISTS (
            SELECT 1
            FROM Seat_reservations sr
            JOIN Bookings b ON sr.bookingid = b.bookingid
            WHERE sr.seatid = se.seatid
            AND b.showid = s.showid
        )
        GROUP BY s.ticketprice;
    `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a seat
router.post("/", async (req, res) => {
    const { seatid, screenid, seatnumber } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("seatid", sql.Int, seatid)
            .input("screenid", sql.Int, screenid)
            .input("seatnumber", sql.NVarChar, seatnumber)
            .query(`
                INSERT INTO Seats (seatid, screenid, seatnumber) 
                VALUES (@seatid, @screenid, @seatnumber)
            `);
        res.send("Seat added successfully!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a seat
router.delete("/:seatid", async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("seatid", sql.Int, req.params.seatid)
            .query("DELETE FROM Seats WHERE seatid = @seatid");
        res.send("Seat deleted successfully!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
