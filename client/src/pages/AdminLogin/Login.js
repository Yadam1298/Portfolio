import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    // Clear any existing login data (for security)
    localStorage.removeItem('token');
    sessionStorage.clear(); // If you're using sessionStorage
    document.title = "Yadam's Login";
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setShowEncrypting(true);

    try {
      const response = await fetch(
        'https://portfolio-server-k361.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        setShowNotification(true);
        // Keep encrypting message until user proceeds
      } else {
        const data = await response.json();
        alert(data.message || 'Invalid username or password');
        setShowEncrypting(false); // Allow retry
      }
    } catch (error) {
      alert('Server error. Please try again later.');
      console.error(error);
      setShowEncrypting(false); // Allow retry
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    setStep(2);
    setShowEncrypting(false); // Done encrypting
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      try {
        const response = await fetch(
          'https://portfolio-server-k361.onrender.com/api/auth/verify-otp',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, otp }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else {
          const data = await response.json();
          alert(data.message || 'Invalid OTP');
        }
      } catch (error) {
        alert('Server error during OTP verification.');
        console.error(error);
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
                  onChange={(e) => setOtp(e.target.value.replace(/\D/, ''))}
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
