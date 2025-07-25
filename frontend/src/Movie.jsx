import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "axios";
import { ReactComponent as DeleteIcon } from './assets/delete.svg';
import { useNavigate } from 'react-router-dom';
import "./Movie.css";

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [reverror, setReverror] = useState("");
  const [times, setTimes] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const userinfo = JSON.parse(localStorage.getItem('user'));
  const tokeninfo = localStorage.getItem('token');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMovie = axios.get(`http://localhost:5000/api/movies/${id}`);
    const fetchShowtimes = axios.get(`http://localhost:5000/api/showtimes`);
    const fetchReviews = axios.get(`http://localhost:5000/api/reviews/${id}`);

    Promise.all([fetchMovie, fetchShowtimes, fetchReviews])
      .then(([moviesRes, showtimesRes, reviewsRes]) => {
        setMovie(moviesRes.data);
        setTimes(showtimesRes.data);
        setReviews(reviewsRes.data);
      })
      .catch(() => {
        setError("Failed to load data!");
      });
  }, [id]);

  if (error) return <h2>{error}</h2>;
  if (!movie) return <h2></h2>;

  const handleTrailer = () => {
    window.location.href = movie.trailer;
  }

  const handlePost = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/LogIn');
    }

    const movieid = id;
    const review_text = text;

    if(review_text === ""){
      setReverror("Review cannot be empty.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/reviews/add', { userid: user.userid, movieid, review_text });
      setReviews(prev => [res.data, ...prev]);
      setReverror("Review added!");
      setText("");

    } catch (err) {
      console.log("Failed to post review:", err);
    }
  }

  const deleteReview = async (rev) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/reviews/delete/${rev.reviewid}`);
      setReviews(prev => prev.filter(r => r.reviewid !== rev.reviewid));
      res.status(200).send("Review deleted successfully");

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="movie-container">

      <div
        className="sec1"
        style={{
          backgroundImage: `url(${movie.movie_bg_url})`,
        }}
      >
        <img src={movie.movie_mainimage_url} alt={movie.moviename} />
      </div>

      <div className="sec2">
        <button onClick={handleTrailer} className="trailer-button">Watch Trailer</button>

        {movie.status === "comingsoon" && (
          <div className="heading">Coming Soon!</div>
        )}

        <div>
          <span className="heading">Name: </span> {movie.moviename}
        </div>
        <div>
          <span className="heading">Release Date: </span> {movie.releasedate.slice(0, 10)}
        </div>
        <div>
          <span className="heading">Genre: </span> {movie.genre}
        </div>

        {movie.rating && (
          <div>
            <span className="heading">IMDB Rating: </span> {movie.rating}
          </div>
        )}

        {movie.duration > 0 && (
          <div>
            <span className="heading">Duration: </span> {Math.floor(movie.duration / 60)}hr{" "}
            {movie.duration % 60}min
          </div>
        )}

        <div className="description">{movie.description || "No description available."}</div>

      </div>

      {movie.status === "showing" && (
        <div className="sec3">
          <div>Movie Timings:</div>
          <div className="timings">
            {times.filter((time) => time.movieid == id)
              .map((time, index) => (
                <div className="showtime-box" key={index}>
                  <span className="date">{time.showdate.slice(0, 10)}</span>
                  <span className="date">{time.screenname}</span>
                  <span className="date ticket-price">{time.ticketprice} Rs</span>
                  {userinfo && tokeninfo ? (
                    <Link to={`/Showtimes/${time.showid}`} key={time.showid}>
                      <span className="time-box">{time.showtime.slice(11, 16)}</span>
                    </Link>
                  ) : (
                    <Link to="/LogIn">
                      <span className="time-box">{time.showtime.slice(11, 16)}</span>
                    </Link>
                  )}
                </div>
              ))}
            {times.filter((time) => time.movieid == id).length === 0 && <span className="noshow-box">No showtimes available.</span>}
          </div>
        </div>
      )}

      {movie.status === "showing" && (
        <div className="reviews-container">
          <h2>Reviews ({reviews.length}) :</h2>
          <div className="new-review">
            <textarea type="text" placeholder="Say Something.." value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={handlePost}>Post</button>
            {reverror && (
              <div>{reverror}</div>
            )}
          </div>

          {reviews.length > 0 ? (
            <div>
              <div className="rev-line"></div>
              {reviews.map((rev, index) => (
                <div key={index} className="review-box">
                  <div className="rev-user-name">{rev.name}</div>
                  <div className="rev-time">{rev.review_date.slice(11, 16)} | {rev.review_date.slice(0, 10)}</div>
                  <div className="rev-text">{rev.review_text}</div>

                  {rev.userid === userinfo?.userid && (
                  <button className='delete-button' onClick={() => deleteReview(rev)}>
                    <DeleteIcon
                      style={{
                        width: '25px',
                        height: '25px',
                        paddingTop: '5px'
                      }}
                    />
                  </button> )}

                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">No Reviews Yet</div>
          )}

        </div>
      )}

    </div>
  );
};

export default Movie;
