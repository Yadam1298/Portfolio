import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios'; // your axios instance
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
    setMessage('');

    // Trim passwords
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirm.trim();

    // Basic validation
    if (!trimmedPassword || !trimmedConfirm) {
      setMessage('Please enter both password fields.');
      return;
    }
    if (trimmedPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }
    if (trimmedPassword !== trimmedConfirm) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, {
        password: trimmedPassword,
      });

      setMessage(res.data.message || 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3 sec
    } catch (err) {
      setMessage(
        err.response?.data?.error || 'Something went wrong. Please try again.'
      );
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
