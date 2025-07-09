import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3 sec
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Set New Password</h2>
      <form className="auth-form" onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="auth-input"
        />
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
