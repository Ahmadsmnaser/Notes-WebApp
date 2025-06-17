import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });

      dispatch({
        type: 'LOGIN',
        payload: {
          token: res.data.token,
          name: res.data.name,
          email: res.data.email,
        },
      });

      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin} data-testid="login_form">
        <div>
          <label>Username:</label>
          <input
            type="text"
            data-testid="login_form_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            data-testid="login_form_password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" data-testid="login_form_login">
          Login
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
