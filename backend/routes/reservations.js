const express = require("express");
const { sql, poolPromise } = require('../db');
const router = express.Router();

// Get all reservations
router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Seat_reservations");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a reservation
router.post("/", async (req, res) => {
    const { bookingid, seatid } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("bookingid", sql.Int, bookingid)
            .input("seatid", sql.Int, seatid)
            .query(`
                INSERT INTO Seat_reservations (bookingid, seatid)
                VALUES (@bookingid, @seatid)
            `);
        res.send("Seat reserved successfully!");
    } catch (err) {
        console.error("Error inserting into Seat_reservations:", err);
        res.status(500).send(err.message);
    }    
});

module.exports = router;
