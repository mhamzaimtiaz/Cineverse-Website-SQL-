import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Search from "./Search";
import Footer from "./Footer";
import Movie from "./Movie";
import Contact from "./Contact"
import About from "./About"
import TopRated from "./TopRated"
import Showtime from "./Showtime"
import Booking from "./Booking"
import SignUp from "./SignUp"
import LogIn from "./LogIn"
import Confirmation from "./Confirmation"
import MyBookings from "./MyBookings"
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Search/:searchedmovie" element={<Search />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/Movies/:id" element={<Movie />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/About" element={<About />} />
          <Route path="/TopRated" element={<TopRated />} />
          <Route path="/Showtimes/:id" element={<Showtime />} />
          <Route path="/Booking/:id" element={<Booking />} />
          <Route path="/Confirmation" element={<Confirmation />} />
          <Route path="/MyBookings" element={<MyBookings />} /> 
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
