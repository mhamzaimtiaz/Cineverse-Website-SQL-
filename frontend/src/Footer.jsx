import "./Footer.css"
import { useState } from 'react'
import validator from "validator";
import axios from "axios";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlesubscribe = async (e) => {
    e.preventDefault();

    if (email === "") {
      setError("Email cannot be empty");
      setSuccess(null);
      return;
    }
    else if (!validator.isEmail(email)) {
      setError("Wrong email address");
      setSuccess(null);
      return;
    }

    try {
      const existingUser = await axios.get(`http://localhost:5000/api/subscribers/${email}`);
      if (existingUser.data.length > 0) {
        setError("User already subscribed");
        setSuccess(null);
        return;
      }
    } catch (err) {
      console.error("Error checking existing user:", err);
    }

    try {
      await axios.post("http://localhost:5000/api/subscribers/new", { email });
      setSuccess("Subscribed successfully!");
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("User already subscribed");
        setSuccess(null);
      } else {
        console.error(err);
        setError("Something went wrong.");
        setSuccess(null);
      }
    }
  }

  return (
    <div>
      <div className="line"></div>
      <footer>
        <div className="genres">
          <div>Genres</div>
          <div className="genre-options">
            {['Action', 'Animation', 'Fantasy', 'Horror', 'Musical', 'Romance', 'Comedy'].map((genre) => (
              <div className="gen-opt" key={genre}>{genre}</div>
            ))}
          </div>
        </div>

        <form className="subscribe" onSubmit={handlesubscribe}>
          <div>Subscribe</div>
          <div>Subscribe to mailing list to receive updates on movies, TV series, and news of top movies.</div>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {error && (
            <div className="subscribe-error">{error}</div>
          )}
          {success && (
            <div className="subscribe-success">{success}</div>
          )}
          <span>
            <button>Subscribe</button>
          </span>
        </form>

        <div className="social-cr">
          <div>Social Link</div>
          <div className="footer-socialicons">
            {['facebook', 'instagram', 'youtube'].map((platform) => (
              <div className="ft-icon" key={platform}>
                <img src={`/images/${platform}-brands-solid.svg`} alt={platform} width={24} height={24} />
              </div>
            ))}
          </div>
          <div className="cr">Copyright</div>
          <div>Copyright @cineverse. All Rights Reserved</div>
          <div>Disclaimer: The site does not store any files on its server. All contents are provided by non-affiliated third parties.</div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
