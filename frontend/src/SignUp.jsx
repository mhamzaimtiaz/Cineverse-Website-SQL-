import { useState, useEffect } from 'react'
import "./SignUp.css"
import { Link } from 'react-router-dom';
import axios from "axios";
import validator from "validator";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate(); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if(user && token){
      navigate('/');
    }
  }, [])

  const handleSignUp = async (e) => {
    e.preventDefault();

    const data = { name, email, password };

    if (name === "" || email === "" || password === "") {
      setError("No slot can be empty");
      return;
    }
    else if (!validator.isEmail(email)) {
      setError("Wrong email address");
      return;
    }
    else if (password.length < 8) {
      setError("Password must be greater than or equal to 8 characters");
      return;
    }

    try {
      const existingUser = await axios.get(`http://localhost:5000/api/users/${email}`);
      if (existingUser.data.length > 0) {
        setError("User already exists");
        return;
      }
    } catch (err) {
      console.error("Error checking existing user:", err);
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log('Server response:', result);
      navigate('/LogIn');
    } catch (err) {
      console.error('Error sending data:', err);
      setError("Sorry, an error occurred. Please try again.");
    }
  }

  return (
    <div className='signup'>
      <form onSubmit={handleSignUp} className='signup-form'>
        <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}></input>
        <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button>Sign Up</button>
        <div className='signup-error'>{error}</div>
      </form>

      <div>If you already have an account, login here:</div>
      <Link to="/LogIn">
        <button className='login-button-signup'>Log In</button>
      </Link>
    </div>
  );
};

export default SignUp;
