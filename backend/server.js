const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies', require('./routes/movies'));
app.use('/api/showtimes', require('./routes/showtimes'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/screens', require('./routes/screens'));
app.use('/api/seats', require('./routes/seats'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/subscribers', require('./routes/subscribers'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
