import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Search = () => {
  const [movies, setMovies] = useState([]);
  const { searchedmovie } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/movies")
      .then((response) => {
        setMovies(response.data);
      });
  }, []);

  const filteredMovies = movies
    .filter((movie) =>
      movie.moviename.toLowerCase().includes(searchedmovie.toLowerCase())
    )

  return (
    <div className="section2">
      {filteredMovies.length > 0 ? (
        filteredMovies.map((movie) => (
          <Link to={`/Movies/${movie.movieid}`} key={movie.movieid}>
            <div className="movie-box">
              <img
                src={movie.movie_mainimage_url}
                alt={movie.moviename}
              />
              <div className="movie-name">{movie.moviename}</div>
              {movie.duration > 0 && (
                <div className="duration">
                  {Math.floor(movie.duration / 60)}hr {movie.duration % 60}min
                </div>
              )}
            </div>
          </Link>
        ))
      ) : (
        <div className="no-booking-error">No movies found</div>
      )}
    </div>
  );
};

export default Search;
