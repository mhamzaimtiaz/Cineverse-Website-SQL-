import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((err) => {
        setError("Failed to load movies!");
      });
  }, []);

  if (error) return <h2 style={{color: 'white'}}>{error}</h2>;
  if (movies.length === 0) return <h2 style={{color: 'white'}}>loading...</h2>;

  return (
    <main>
      <div className="section1">
        <div className="box"></div>
        <div className="main-texts">
          <div className="text1">
            Welcome to <span>CineVerse</span>
          </div>
          <div className="text2">Your Ultimate Movie Universe!</div>
          <div className="text3">
            Discover the latest blockbusters, timeless classics, and hidden
            gems. Stay updated with showtimes, reviews, and exclusive content.
            Dive into the world of cinema like never before!
          </div>
          <Link to={"/About"}>
            <button className="readmore">Read More</button>
          </Link>
        </div>
      </div>

      <div className="line"></div>

      <div className="now-showing">Now Showing</div>

      <div className="section2">
        {movies.filter((movie) => movie.status === "showing")
        .map((movie) => (
          <Link to={`/Movies/${movie.movieid}`} key={movie.movieid}>
            <div className="movie-box" key={movie.movieid}>
              <img src={movie.movie_mainimage_url} alt={movie.moviename} />
              <div className="movie-name">{movie.moviename}</div>
              {movie.duration > 0 && (<div className="duration">{Math.floor(movie.duration / 60)}hr{" "}{movie.duration % 60}min</div>)}
            </div>
          </Link>
        ))}
      </div>

      <div className="now-showing">Coming Soon</div>

      <div className="section2">
        {movies.filter((movie) => movie.status === "comingsoon")
        .map((movie) => (
          <Link to={`/Movies/${movie.movieid}`} key={movie.movieid}>
            <div className="movie-box" key={movie.movieid}>
              <img src={movie.movie_mainimage_url} alt={movie.moviename} />
              <div className="movie-name">{movie.moviename}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Home;
