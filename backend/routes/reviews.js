const express = require("express");
const { sql, poolPromise } = require('../db');
const router = express.Router();

// Get all reviews for a movie
router.get("/:id", async (req, res) => {
    const movieid = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
        .input('movieid', sql.Int, movieid)
        .query(`
            select R.*, U.name from Reviews R
            inner join Users U on R.userid = U.userid
            where R.movieid = @movieid
            order by review_date desc
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a new review
router.post("/add", async (req, res) => {
    const { userid, movieid, review_text } = req.body;
    try {
        const pool = await poolPromise;
        const insertResult = await pool.request()
    .input("userid", sql.Int, userid)
    .input("movieid", sql.Int, movieid)
    .input("review_text", sql.Text, review_text)
    .query(`
        INSERT INTO Reviews (userid, movieid, review_text) 
        VALUES (@userid, @movieid, @review_text);
        SELECT SCOPE_IDENTITY() AS reviewid;
    `);

const reviewid = insertResult.recordset[0].reviewid;

const result = await pool.request()
    .input("reviewid", sql.Int, reviewid)
    .query(`
        SELECT r.*, u.name
        FROM Reviews r
        JOIN Users u ON r.userid = u.userid
        WHERE r.reviewid = @reviewid
    `);
          res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a review
router.delete("/delete/:reviewid", async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("reviewid", sql.Int, req.params.reviewid)
            .query("DELETE FROM Reviews WHERE reviewid = @reviewid");
        res.send("Review deleted successfully!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
