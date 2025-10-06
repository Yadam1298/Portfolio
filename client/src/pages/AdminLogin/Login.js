import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios'; // ✅ import axios instance
import './Login.css';

const Login = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showEncrypting, setShowEncrypting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    document.title = "Yadam's Login";
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setShowEncrypting(true);

    try {
      const { data: _data } = await axios.post('/api/auth/login', {
        username,
        password,
      });
      // OTP sent successfully
      setShowNotification(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid username or password');
      setShowEncrypting(false);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    setStep(2);
    setShowEncrypting(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      try {
        const { data: _data } = await axios.post('/api/auth/verify-otp', {
          username,
          otp,
        });
        localStorage.setItem('token', _data.token);
        navigate('/dashboard');
      } catch (error) {
        alert(error.response?.data?.message || 'Invalid OTP');
      }
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  };

  return (
    <div className="login-hacker-container">
      <div className="cyber-glow-frame">
        {step === 1 && !showNotification && (
          <>
            <h1 className="login-title">AI Access Panel</h1>
            <form onSubmit={handleLoginSubmit} autoComplete="off">
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  disabled={showEncrypting}
                />
                <span className="highlight"></span>
                <label>Username</label>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={showEncrypting}
                />
                <span className="highlight"></span>
                <label>Password</label>
              </div>
              <p className="forgot-password-link">
                <a href="/forgot-password">Forgot Password?</a>
              </p>
              <button
                className="glow-button"
                type="submit"
                disabled={showEncrypting}
              >
                {showEncrypting ? 'Encrypting credentials...' : 'Initiate'}
              </button>
            </form>
          </>
        )}

        {step === 2 && !showNotification && (
          <>
            <h1 className="login-title">OTP Verification</h1>
            <form onSubmit={handleOtpSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  pattern="\d{6}"
                  autoComplete="off"
                />
                <span className="highlight"></span>
                <label>6-digit OTP</label>
              </div>
              <button className="glow-button" type="submit">
                Authenticate
              </button>
            </form>
          </>
        )}
      </div>

      {showNotification && (
        <div className="notification-overlay">
          <div className="notification-box">
            <h2>OTP Sent</h2>
            <p>A one-time password has been sent to your registered email.</p>
            <button onClick={handleCloseNotification}>Proceed</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
