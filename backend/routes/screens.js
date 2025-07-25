const express = require("express");
const { sql, poolPromise } = require('../db');
const router = express.Router();

// Get all screens
router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Screens");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a new screen
router.post("/", async (req, res) => {
    const { screenid, screenname, totalseats } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("screenid", sql.Int, screenid)
            .input("screenname", sql.NVarChar, screenname)
            .input("totalseats", sql.Int, totalseats)
            .query(`
                INSERT INTO Screens (screenid, screenname, totalseats) 
                VALUES (@screenid, @screenname, @totalseats)
            `);
        res.send("Screen added successfully!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a screen
router.delete("/:screenid", async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("screenid", sql.Int, req.params.screenid)
            .query("DELETE FROM Screens WHERE screenid = @screenid");
        res.send("Screen deleted successfully!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
