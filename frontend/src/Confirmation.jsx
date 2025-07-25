import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import "./Confirmation.css"

const Confirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const hasBooked = useRef(false);
    const hasReserved = useRef(false);
    const [bookingId, setBookingId] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const local = JSON.parse(localStorage.getItem('finalbookingdetails'));

    const userinfo = localStorage.getItem('user');
    const tokeninfo = localStorage.getItem('token');

    useEffect(() => {
        const bookingdata = location.state;
        const user = JSON.parse(localStorage.getItem('user'));
        const userid = user?.userid;
        const showid = bookingdata?.id;
        const total_price = bookingdata?.totalbill;

        const rawSeats = bookingdata?.selectedSeats;
        const formattedSeats = Array.isArray(rawSeats) ? rawSeats : Object.values(rawSeats || {});
        console.log("Formatted Seats:", formattedSeats);
        setSelectedSeats(formattedSeats);

        const handleBooking = async () => {
            if (hasBooked.current) return;
            hasBooked.current = true;

            try {
                const res = await axios.post('http://localhost:5000/api/bookings/new', {
                    userid,
                    showid,
                    total_price
                });
                setBookingId(res.data.bookingid);
                console.log("Booking added successfully, ID:", res.data.bookingid);
            } catch (err) {
                console.error("Booking error:", err);
                setError("Sorry, Booking failed");
            }
        };

        handleBooking();
    }, [location]);

    useEffect(() => {
        const handlereservation = async () => {
            if (hasReserved.current || !bookingId || selectedSeats.length === 0) return;
            hasReserved.current = true;

            try {
                await Promise.all(
                    selectedSeats.map((seat) => {
                        return axios.post('http://localhost:5000/api/reservations', {
                            bookingid: bookingId,
                            seatid: seat.seatid
                        });
                    })
                );
                console.log("Seats reserved successfully");
                localStorage.removeItem('finalbookingdetails');
            } catch (err) {
                console.error("Reservation error:", err?.response?.data || err.message);
                setError("Sorry, reservation failed");
            }
        };

        handlereservation();
    }, [bookingId, selectedSeats]);

    if (!userinfo || !tokeninfo) navigate('/LogIn');

    if (!local) return <div>ERROR</div>
    if (error) return <div>{error}</div>;

    return (
        <div className='confirmation-outer-box'>
            <h2 className='success-heading'>Booking Successful</h2>
            {local && (
                <div className='confirmation-inner-box'>
                    <div>Number of tickets booked : {local.ticketquantity}</div>
                    <div>Total Bill : {local.totalbill} Rs</div>
                    <span>Seat Numbers :</span>
                    <div className='seats-box'>
                        {local.selectedSeats.map((seat, idx) => (
                            <span key={idx} className='seat-num-box'>{seat.seatnumber}</span>
                        ))}

                    </div>
                </div>
            )}

            <Link to="/">
                <button className='finish-button'>EXIT</button>
            </Link>
        </div>
    );
};

export default Confirmation;
