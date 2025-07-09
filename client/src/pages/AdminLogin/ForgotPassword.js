import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendLink = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.get(
        'http://localhost:5000/api/auth/reset-password'
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Forgot Password</h2>
      <button
        className="auth-button"
        onClick={handleSendLink}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Password Reset Link'}
      </button>
      {message && <p className="auth-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
