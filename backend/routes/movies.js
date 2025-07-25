const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// Top rated movies
router.get('/top-rated', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT * FROM Movies WHERE status = 'showing' ORDER BY rating DESC"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all movies
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT * FROM Movies"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single movie by ID
router.get('/:id', async (req, res) => {
  const movieid = req.params.id;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('movieid', sql.Int, movieid)
      .query("SELECT * FROM Movies WHERE movieid = @movieid");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a movie
router.post('/', async (req, res) => {
  const { movieid, moviename, genre, duration, rating, releasedate, movie_bg_url, movie_mainimage_url } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('movieid', sql.Int, movieid)
      .input('moviename', sql.VarChar(100), moviename)
      .input('genre', sql.VarChar(50), genre)
      .input('duration', sql.Int, duration)
      .input('rating', sql.Decimal(2, 1), rating)
      .input('releasedate', sql.Date, releasedate)
      .input('movie_bg_url', sql.VarChar(100), movie_bg_url)
      .input('movie_mainimage_url', sql.VarChar(100), movie_mainimage_url)
      .query(`INSERT INTO Movies (movieid, moviename, genre, duration, rating, releasedate, movie_bg_url, movie_mainimage_url) 
             VALUES (@movieid, @moviename, @genre, @duration, @rating, @releasedate, @movie_bg_url, @movie_mainimage_url)`);

    res.status(201).json({ message: 'Movie added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a movie
router.put('/:id', async (req, res) => {
  const { moviename, genre, duration, rating, releasedate, movie_bg_url, movie_mainimage_url } = req.body;
  const movieid = req.params.id;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('movieid', sql.Int, movieid)
      .input('moviename', sql.VarChar(100), moviename)
      .input('genre', sql.VarChar(50), genre)
      .input('duration', sql.Int, duration)
      .input('rating', sql.Decimal(2, 1), rating)
      .input('releasedate', sql.Date, releasedate)
      .input('movie_bg_url', sql.VarChar(100), movie_bg_url)
      .input('movie_mainimage_url', sql.VarChar(100), movie_mainimage_url)
      .query(`UPDATE Movies SET 
              moviename = @moviename, genre = @genre, duration = @duration, rating = @rating, 
              releasedate = @releasedate, movie_bg_url = @movie_bg_url, movie_mainimage_url = @movie_mainimage_url
              WHERE movieid = @movieid`);

    res.json({ message: 'Movie updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a movie
router.delete('/:id', async (req, res) => {
  const movieid = req.params.id;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('movieid', sql.Int, movieid)
      .query("DELETE FROM Movies WHERE movieid = @movieid");

    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
