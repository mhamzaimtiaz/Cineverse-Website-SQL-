import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      
      <div>
        <h1>Contact Us</h1>
        <p className="intro">We would love to hear from you! Whether you have questions,
          feedback, or need assistance, feel free to reach out to us.</p>
      </div>

      <div className="contact-section">
        <h2>📍 Our Location</h2>
        <p>CineVerse Cinemas,<br /> Plot #123, Main Boulevard,<br /> Gulberg, Lahore, Pakistan</p>
      </div>

      <div className="contact-section">
        <h2>📞 Call Us</h2>
        <p><strong>For Booking & Inquiries:</strong> +92 310 4134562</p>
        <p><strong>Customer Support:</strong> +92 320 4646656</p>
      </div>

      <div className="contact-section">
        <h2>📧 Email Us</h2>
        <p><strong>General Queries:</strong> info@cineverse.pk</p>
        <p><strong>Support:</strong> support@cineverse.pk</p>
      </div>

      <div className="contact-section">
        <h2>🕒 Our Timings</h2>
        <p><strong>Monday - Friday:</strong> 10:00 AM - 03:00 AM</p>
        <p><strong>Saturday - Sunday:</strong> 9:00 AM - 4:00 AM</p>
      </div>

      <div className="contact-section">
        <h2>🌐 Follow Us on Social Media</h2>
        <p>📍 <a href="#">Facebook</a></p>
        <p>📍 <a href="#">Instagram</a></p>
        <p>📍 <a href="#">Twitter</a></p>
      </div>
    </div>
  );
};

export default Contact;
