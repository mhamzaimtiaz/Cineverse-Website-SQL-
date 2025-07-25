const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const { sql, poolPromise } = require('../db');

router.post("/new", async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await poolPromise;

    const checkExisting = await pool.request()
      .input("subemail", sql.VarChar(50), email)
      .query("SELECT subid FROM Subscribers WHERE subemail = @subemail");

    if (checkExisting.recordset.length > 0) {
      return res.status(409).json({ error: "User already subscribed" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cineversecinemaslhr@gmail.com",
        pass: "msnzopbmwwuravnb",
      },
    });

    const mailOptions = {
      from: "cineversecinemaslhr@gmail.com",
      to: email,
      subject: "Welcome to CineVerse!",
      text: "Thankyou for signing up, looking forward to see you at CineVerse!",
    };

    await transporter.sendMail(mailOptions);

    await pool.request()
      .input("subemail", sql.VarChar(50), email)
      .query("INSERT INTO Subscribers (subemail) VALUES (@subemail)");

    res.status(200).json({ message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Error sending email or saving subscriber:", error);
    res.status(500).json({ error: "Subscriber save failed" });
  }
});

router.get('/:subemail', async (req, res) => {
  const subemail = req.params.subemail;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('subemail', sql.VarChar(50), subemail)
      .query(`SELECT subid FROM Subscribers WHERE subemail = @subemail`);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
