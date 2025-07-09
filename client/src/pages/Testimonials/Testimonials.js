import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    message: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/testimonials')
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error('Error loading testimonials:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/testimonials',
        newTestimonial
      );
      setTestimonials([...testimonials, res.data]);
      setNewTestimonial({ name: '', message: '' });
      setSubmitMessage('Thank you for your testimonial!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSubmitMessage(''), 4000);
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitMessage('Failed to submit testimonial');
      setTimeout(() => setSubmitMessage(''), 4000);
    }
  };

  return (
    <section className="public-testimonial-section">
      <h1 className="public-testimonial-title">What Others Say</h1>

      <div className="public-testimonial-wrapper">
        {testimonials.length === 0 ? (
          <p className="public-testimonial-no-message">
            No testimonials available
          </p>
        ) : (
          testimonials.map((t, i) => (
            <div className="public-testimonial-card" key={i}>
              <div className="public-testimonial-profile">
                <div className="public-testimonial-avatar">
                  {t.image ? (
                    <img src={t.image} alt={t.name} />
                  ) : (
                    <span>{t.name ? t.name.charAt(0) : '?'}</span>
                  )}
                </div>
                <div className="public-testimonial-meta">
                  <h3 className="public-testimonial-name">{t.name}</h3>
                  {t.position && (
                    <p className="public-testimonial-position">{t.position}</p>
                  )}
                </div>
              </div>
              <p className="public-testimonial-message">"{t.message}"</p>
            </div>
          ))
        )}
      </div>

      {/* Add Testimonial Form */}
      <form className="public-testimonial-form" onSubmit={handleSubmit}>
        <h2
          className="public-testimonial-title"
          style={{ fontSize: '1.8rem', marginTop: '4rem' }}
        >
          Add Your Testimonial
        </h2>
        <input
          type="text"
          placeholder="Your Name"
          value={newTestimonial.name}
          onChange={(e) =>
            setNewTestimonial({ ...newTestimonial, name: e.target.value })
          }
          required
          className="public-testimonial-input"
        />
        <textarea
          placeholder="Your Feedback"
          value={newTestimonial.message}
          onChange={(e) =>
            setNewTestimonial({ ...newTestimonial, message: e.target.value })
          }
          required
          className="public-testimonial-textarea"
        />
        <button type="submit" className="public-testimonial-button">
          Submit Testimonial
        </button>
        {submitMessage && (
          <p className="public-testimonial-submit-msg">{submitMessage}</p>
        )}
      </form>
    </section>
  );
};

export default Testimonials;
