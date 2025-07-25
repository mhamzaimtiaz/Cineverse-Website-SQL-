import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./TopRated.css";

const TopRated = () => {
    const [toprated, setToprated] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/movies/top-rated")
            .then((response) => {
                setToprated(response);
            })
            .catch((err) => {
                setError("Failed to load top rated movies!");
            });
    }, []);

    if (error) return <h2>{error}</h2>;
    if (toprated.length === 0) return <h2> </h2>;

    console.log('Top rated:', toprated);

    return (
        <div className="outer-box">
            {toprated.data.map((mov) => (
                <div className="toprated-box" style={{ backgroundImage: `url(${mov.movie_bg_url})` }}>
                    <Link to={`/Movies/${mov.movieid}`} key={mov.movieid}>
                        <img src={mov.movie_mainimage_url} alt={mov.moviename} />
                    </Link>
                    <div className="details">
                        <div>Name : {mov.moviename}</div>
                        <div>Rating : {mov.rating}</div>
                        <div>Genre : {mov.genre}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TopRated;
