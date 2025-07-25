import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About CineVerse</h1>
      <p>
        Welcome to <span className="highlight">CineVerse</span>, your premier destination for an
        unparalleled movie experience. We bring the latest blockbusters, timeless classics, and exclusive screenings to movie lovers.
      </p>
      <h2>Our Story</h2>
      <p>
        Founded in 2020, CineVerse has quickly grown to become one of the leading cinema chains in Pakistan. Our mission is to create a
        space where people can escape into the world of film, with state-of-the-art screens and immersive sound systems.
      </p>
      <h2>Why Choose Us?</h2>
      <ul>
        <li>✔ Luxurious seating and high-quality projection systems</li>
        <li>✔ Online booking with seat selection</li>
        <li>✔ Special discount offers and loyalty programs</li>
        <li>✔ Cafeteria with a variety of snacks and beverages</li>
      </ul>
      <h2>Join Us</h2>
      <p>
        Experience cinema like never before. Whether its a family outing, date night, or solo movie adventure, CineVerse is the place to be!
      </p>
    </div>
  );
};

export default About;
