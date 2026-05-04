'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const sendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Sending OTP to:', email);

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log('Send OTP response:', data);

      if (!res.ok) {
        if (res.status === 403) {
          setError(data.message); // show message
          return; // 🚫 stop here, don't throw
        }

        throw new Error(data.message || 'Failed to send OTP');
      }

      setStep(2);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Verifying OTP for:', email);

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      console.log('Verify OTP response:', data);

      if (!res.ok) {
        if (res.status === 403) {
          setError(data.message); // show message
          return; // 🚫 stop here, don't throw
        }

        throw new Error(data.message || 'Failed to send OTP');
      }

      // Store token in sessionStorage
      sessionStorage.setItem('admin_token', data.token);

      // ALSO store in localStorage as backup
      localStorage.setItem('admin_token', data.token);

      // Set cookie for middleware to read
      document.cookie = `admin_token=${data.token}; path=/; max-age=604800`; // 7 days

      console.log('Token stored in multiple locations');

      // Force hard navigation instead of router.replace
      window.location.href = '/admin';
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Login</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: 10 }}>Error: {error}</div>
      )}

      {step === 1 && (
        <>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{ display: 'block', marginBottom: 10, padding: 8 }}
          />
          <button onClick={sendOTP} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
            style={{ display: 'block', marginBottom: 10, padding: 8 }}
          />
          <button onClick={verifyOTP} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}
    </div>
  );
}
