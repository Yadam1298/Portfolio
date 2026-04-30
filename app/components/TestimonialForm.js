'use client';

import { useState } from 'react';

export default function TestimonialForm() {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      setError('Please fill in both name and message');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // FIXED: Use the public endpoint instead of admin endpoint
      const res = await fetch('/api/testimonials/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', message: '' });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError(data.error || 'Failed to submit testimonial');
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setError('Failed to submit testimonial. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-4">
        Share Your Experience
      </h3>
      <p className="text-gray-400 mb-6">
        I'd love to hear your feedback about working with me!
      </p>

      {submitted && (
        <div className="mb-4 p-3 bg-green-600/20 border border-green-500/50 rounded-lg text-green-400 text-center">
          ✅ Thank you for your testimonial! It will be reviewed and published
          soon.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg text-red-400 text-center">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
            placeholder="Share your experience working with me..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-indigo-500/25"
        >
          {submitting ? 'Submitting...' : '💬 Submit Testimonial'}
        </button>
      </form>
    </div>
  );
}
