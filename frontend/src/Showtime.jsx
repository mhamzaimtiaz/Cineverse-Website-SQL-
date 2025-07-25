import React, { useEffect, useState } from 'react';
import "./Showtime.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Showtime = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [seatinfo, setSeatinfo] = useState(null);
  const [error, setError] = useState(null);
  const [ticketquantity, setTicketquantity] = useState(0);

  const userinfo = localStorage.getItem('user');
  const tokeninfo = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/seats/availseatsandprice/${id}`)
      .then((response) => {
        setSeatinfo(response.data[0]);
      })
      .catch((err) => {
        setError("Failed to load seat info!");
      });
  }, [id]);

  const handleDecrement = () => {
    if (ticketquantity > 0) {
      setTicketquantity(prev => prev - 1);
    }
  };

  const handleIncrement = () => {
    if (seatinfo && ticketquantity < seatinfo.availseats) {
      setTicketquantity(prev => prev + 1);
    }
  };

  const totalbill = seatinfo ? ticketquantity * seatinfo.ticketprice : 0;
  const available = seatinfo ? seatinfo.availseats - ticketquantity : 0;

  if(!userinfo || !tokeninfo) navigate('/LogIn');

  if (error) return <div>{error}</div>;
  if (!seatinfo) return <div>Loading seat info...</div>;

  return (
    <div className='booking-details-box'>

      <h2>Select number of seats :</h2>
      <h4>Available Seats : {available}</h4>

      <div className='quantity-box'>
        {ticketquantity > 0 ? (
          <button className="quantity-button" onClick={handleDecrement}>-</button>
        ) : (
          <button className="quantity-button" disabled>-</button>
        )}

        <div>{ticketquantity}</div>

        {ticketquantity < seatinfo.availseats ? (
          <button className="quantity-button" onClick={handleIncrement}>+</button>
        ) : (
          <button className="quantity-button" disabled>+</button>
        )}
      </div>

      {totalbill > 0 ? (
      <div className='total-bill'>Total Bill: {totalbill} Rs</div>
      ) : <div className='total-bill'>Total Bill : - </div>}

      {ticketquantity > 0 ? (
        <Link
          to={`/Booking/${id}`}
          bookinginfo={{ ticketquantity, totalbill }}
          onClick={() => {
            localStorage.setItem('bookingData', JSON.stringify({
              ticketquantity,
              totalbill
            }));
          }}
        >
          <button className='next-button'>Next</button>
        </Link>
      ) : (<button className='next-button' disabled>Next</button>)}
    </div>
  );
};

export default Showtime;
