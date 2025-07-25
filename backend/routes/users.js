const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Sign Up new user
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const pool = await poolPromise;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.request()
      .input("name", sql.VarChar(50), name)
      .input("email", sql.VarChar(50), email)
      .input("password", sql.VarChar(255), hashedPassword)
      .input("role", sql.VarChar(50), "customer")
      .query("INSERT INTO Users (name, email, password, role) VALUES (@name, @email, @password, @role)");

    res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("email", sql.VarChar(50), email)
      .query("SELECT * FROM Users WHERE email = @email");

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userid: user.userid }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get User Profile by Email
router.get('/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar(50), email)
      .query(`SELECT userid FROM Users WHERE email = @email`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Profile by ID
router.get('/:id', async (req, res) => {
  const userid = req.params.id;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userid', sql.Int, userid)
      .query(`SELECT userid, name, email, role FROM Users WHERE userid = @userid`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Users
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT userid, name, email, role FROM Users');

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
