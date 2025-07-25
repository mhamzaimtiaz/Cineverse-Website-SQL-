import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LogIn.css';

const LogIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if(user && token){
      navigate('/');
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setError('No slot can be empty');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      
      const { token, user } = res.data;

      if (user && user.userid) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        setError('Invalid login credentials');
      }

    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleLogin} className="login-form">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Log In</button>
        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
};

export default LogIn;
