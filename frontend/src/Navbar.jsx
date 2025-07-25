import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [active, setActive] = useState("home");
  const [isFocused, setIsFocused] = useState(false);
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [isloggedin, setIsloggedin] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/movies')
      .then((response) => {
        setMovies(response.data);
      })
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    setIsloggedin(user && token ? true : false);
  });

  const handleClick = (option) => {
    setActive(option);
  };

  const handlelogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const bookingData = localStorage.getItem('bookingData');
    if (bookingData) {
      localStorage.removeItem('bookingData');
    }
    setIsloggedin(false);
    navigate('/LogIn');
  }

  return (
    <nav>
      <div className="bar1">
        <div className="logo">
          <img src="/images/logo.png" alt="Website Logo" />
        </div>
        <div className="textbox">
          <input type="text" placeholder="Search movies..." value={search} onFocus={() => setIsFocused(true)} onBlur={() => setTimeout(() => setIsFocused(false), 150)} onChange={(e) => setSearch(e.target.value)} />

          {isFocused && search && (
            <div className="search-results">
              {movies.filter((movie) =>
                movie.moviename.toLowerCase().includes(search.toLowerCase())
              ).length > 0 ? (
                movies.filter((movie) =>
                  movie.moviename.toLowerCase().includes(search.toLowerCase())
                )
                  .slice(0, 5).map((movie) => (
                    <Link to={`/Movies/${movie.movieid}`} key={movie.id}>
                      <div className="movie-search-box">
                        <div>{movie.moviename}</div>
                        <img src={movie.movie_mainimage_url} />
                      </div>
                    </Link>
                  ))
              ) : (
                <div className="no-movies-found">No movies found</div>
              )}
            </div>
          )}

          {search.trim() ? (
            <Link to={`/Search/${search}`}>
              <button>Search</button>
            </Link>
          ) : (
            <button disabled>Search</button>
          )}

        </div>
      </div>

      <div className="bar2">
        <div className="options">

          <Link to="/" onClick={() => handleClick("home")}>
            <div className={`option ${active === "home" ? "home" : ""}`}>Home</div>
          </Link>

          {isloggedin ? (
            <Link to="/MyBookings" onClick={() => handleClick("mybookings")}>
              <div className={`option ${active === "mybookings" ? "home" : ""}`}>My Bookings</div>
            </Link>) : (
            <Link to="/LogIn" onClick={() => handleClick("mybookings")}>
              <div className={`option ${active === "mybookings" ? "home" : ""}`}>My Bookings</div>
            </Link>
          )}

          <Link to="/TopRated" onClick={() => handleClick("toprated")}>
            <div className={`option ${active === "toprated" ? "home" : ""}`}>Top Rated</div>
          </Link>

          <Link to="/Contact" onClick={() => handleClick("contact")}>
            <div className={`option ${active === "contact" ? "home" : ""}`}>Contact Us</div>
          </Link>
          <Link to="/About" onClick={() => handleClick("about")}>
            <div className={`option ${active === "about" ? "home" : ""}`}>About</div>
          </Link>

        </div>

        <div className="nav-socialicons">

          {isloggedin ? (
            <div className="logged-in-box">
              <div>Hi, {user.name}</div>
              <button className="signup-login-button" onClick={handlelogout}>Log Out</button>
            </div>
          ) : (
            <Link to="/SignUp">
              <button className="signup-login-button">SignUp/LogIn</button>
            </Link>
          )}

          <div className="icon">
            <img src="/images/facebook-brands-solid.svg" alt="Facebook" />
          </div>
          <div className="icon">
            <img src="/images/instagram-brands-solid.svg" alt="Instagram" />
          </div>
          <div className="icon">
            <img src="/images/youtube-brands-solid.svg" alt="YouTube" />
          </div>
        </div>
      </div>

      <div className="line"></div>

    </nav>
  );
};

export default Navbar;
