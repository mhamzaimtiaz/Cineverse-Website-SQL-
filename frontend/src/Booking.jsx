import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArmchairIcon } from './assets/armchair.svg';
import "./Booking.css";

const Booking = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [ticketquantity, setTicketquantity] = useState(0);
    const [totalbill, setTotalbill] = useState(0);
    const [seatdata, setSeatdata] = useState([]);
    const [error, setError] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const local = JSON.parse(localStorage.getItem('bookingData'));

    const userinfo = localStorage.getItem('user');
    const tokeninfo = localStorage.getItem('token');

    useEffect(() => {
        const bookinginfo = location.bookinginfo;

        if (bookinginfo) {
            setTicketquantity(bookinginfo.ticketquantity);
            setTotalbill(bookinginfo.totalbill);
        } else {
            const localData = JSON.parse(localStorage.getItem('bookingData'));
            if (localData) {
                setTicketquantity(localData.ticketquantity);
                setTotalbill(localData.totalbill);
            }
        }

        axios
            .get(`http://localhost:5000/api/seats/seatsavailability/${id}`)
            .then((response) => {
                setSeatdata(response.data);
            })
            .catch((err) => {
                setError("Failed to load seat data");
            })

    }, []);

    if (!userinfo || !tokeninfo) navigate('/LogIn');

    if (error) return (<div>{error}</div>);
    if (!local) return (<div>ERROR</div>);
    if (!seatdata) return (<div>loading seatdata..</div>);

    const toggleSeat = (seatid, seatnumber) => {
        setSelectedSeats((prevSelected) => {
            const isAlreadySelected = prevSelected.some(
                (seat) => seat.seatid === seatid
            );

            if (isAlreadySelected) {
                return prevSelected.filter((seat) => seat.seatid !== seatid);
            } else {
                if (prevSelected.length < ticketquantity) {
                    return [...prevSelected, { seatid, seatnumber }];
                } else {
                    return prevSelected;
                }
            }
        });
    };

    return (
        <div className='booking-box'>
            {ticketquantity === 1 ? (
                <h3>Please select {ticketquantity} seat</h3>
            ) : <h3>Please select {ticketquantity} seats</h3>}

            <div className='chairs-outer-box'>
                {seatdata.map((data) => {
                    const isSelected = selectedSeats.some(
                        (seat) => seat.seatid === data.seatid
                    );

                    return (
                        <div key={data.seatid} className='chairs-inner-box'>
                            {data.Availability === 'available' ? (
                                <button
                                    className={`chair-button ${isSelected ? "selected" : ""}`}
                                    onClick={() => toggleSeat(data.seatid, data.seatnumber)}
                                >
                                    <ArmchairIcon
                                        style={{
                                            fill: isSelected ? 'blue' : 'green',
                                            width: '40px',
                                            height: '40px',
                                        }}
                                    />
                                </button>
                            ) : (
                                <button disabled className='chair-button'>
                                    <ArmchairIcon
                                        style={{
                                            fill: 'red',
                                            width: '40px',
                                            height: '40px',
                                            stroke: 'black',
                                        }}
                                    />
                                </button>
                            )}
                            <div>{data.seatnumber}</div>
                        </div>
                    );
                })}
            </div>

            {selectedSeats.length === ticketquantity ? (
                <Link to="/Confirmation"
                    state={{ id, totalbill, selectedSeats }}
                    onClick={() => {
                        localStorage.removeItem('bookingData');

                        localStorage.setItem('finalbookingdetails', JSON.stringify({
                            id,
                            ticketquantity,
                            totalbill,
                            selectedSeats
                        }));
                    }}
                >
                    <button
                        className='book-now'>Book Now!
                    </button>
                </Link>
            ) : <button disabled className='book-now'>Book Now!</button>}
        </div>
    );

};

export default Booking;
