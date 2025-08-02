import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateUserPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/users', {
        name,
        email,
        username,
        password,
      });

      navigate('/'); // Go back to homepage after registration (still logged out)
    } catch (err) {
      setError('Failed to create user. Try again.');
    }
  };

  return (
    <div>
      <h2>Create New User</h2>
      <form onSubmit={handleCreateUser} data-testid="create_user_form">
        <div>
          <label>Name:</label>
          <input
            type="text"
            data-testid="create_user_form_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            data-testid="create_user_form_email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Username:</label>
          <input
            type="text"
            data-testid="create_user_form_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            data-testid="create_user_form_password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" data-testid="create_user_form_create_user">
          Create User
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateUserPage;
