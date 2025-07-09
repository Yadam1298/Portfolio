import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactMe.css';

const ContactMe = () => {
  const [content, setContent] = useState({ title: '', paragraphs: [] });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(
          'https://portfolio-server-k361.onrender.com/api/contact'
        );
        setContent(res.data);
      } catch (err) {
        console.error('Error fetching contact content:', err);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      alert('Please enter your name and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'https://portfolio-server-k361.onrender.com/api/contact/submit-message',
        form
      );
      if (res.data.success) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
    setLoading(false);
    setSubmitted(true);
  };

  const closePopup = () => {
    setSubmitted(false);
    setStatus('');
  };

  return (
    <section className="contactme-wrapper">
      <div className="contactme-inner">
        <div className="contactme-info-section">
          <h2 className="contactme-title">
            {content?.title || "Yadam's Diary Lobby"}
          </h2>
          {(content?.paragraphs || []).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="contactme-form-section">
          <form className="contactme-form" onSubmit={handleSubmit} noValidate>
            <label>
              <div className="contactme-label">
                <span>Name</span>
                <span className="contactme-required">*</span>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Your alias"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </label>

            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="Optional"
                value={form.email}
                onChange={handleChange}
                autoComplete="off"
              />
            </label>

            <label>
              <div className="contactme-label">
                <span>Message</span>
                <span className="contactme-required">*</span>
              </div>
              <textarea
                name="message"
                placeholder="Write your log entry..."
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="contactme-btn-submit"
            >
              {loading ? 'Encrypting...' : 'Send Log Entry'}
            </button>
          </form>
        </div>
      </div>

      {submitted && (
        <div
          className="contactme-popup-overlay"
          onClick={closePopup}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closePopup();
          }}
        >
          <div
            className="contactme-popup-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <p className="contactme-popup-text">
              {status === 'success' ? (
                <>
                  Message logged successfully.
                  <br />
                  Click outside this box or press ESC to close.
                </>
              ) : (
                <>
                  Failed to log message.
                  <br />
                  Please try again later.
                </>
              )}
            </p>
            <button onClick={closePopup} className="contactme-btn-close">
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactMe;
