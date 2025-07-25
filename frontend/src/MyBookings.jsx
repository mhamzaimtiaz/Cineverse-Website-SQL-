import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactComponent as DeleteIcon } from './assets/delete.svg';
import "./MyBookings.css"

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bookings/mybookings/${user.userid}`)
      .then((response) => {
        setBookings(response.data);
        console.log(bookings);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDelete = async (booking) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${booking.bookingid}`);

      setBookings(prev => prev.filter(b => b.bookingid !== booking.bookingid));

      console.log('Booking deleted successfully');

    } catch (err) {
      console.log('Error deleting booking', err);
    }
  }

  if(bookings?.length === 0) return <div className='no-booking-error'>No Bookings</div>

  return (
    <div className='my-bookings-outer-box'>
      {bookings?.map((booking, index) => (
        <div className="my-bookings-inner-box" key={index}>
          <div className="booking-info">
            <h3>{booking.moviename}</h3>
            <p><strong>Screen:</strong> {booking.screenname}</p>
            <p><strong>Seats:</strong> {booking.seat_numbers}</p>
            <p><strong>Date: {booking.showdate.slice(0, 10)}</strong></p>
            <p><strong>Timing: {booking.showtime.slice(11, 16)}</strong></p>
            <p><strong>Total Price:</strong> {booking.total_price} Rs</p>

            <button className='delete-button' onClick={() => handleDelete(booking)}>
              <DeleteIcon
                style={{
                  width: '30px',
                  height: '30px'
                }}
              />
            </button>
          </div>
          <div className='my-booking-img'>
            <img src={booking.movie_mainimage_url} alt={booking.moviename} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
