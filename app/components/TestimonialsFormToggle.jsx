'use client';

import { useState } from 'react';
import TestimonialForm from './TestimonialForm';

export default function TestimonialsFormToggle() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* SHOW BUTTON INITIALLY */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-semibold shadow-lg"
        >
          ✍️ Write a Testimonial
        </button>
      )}

      {/* SHOW FORM AFTER CLICK */}
      {showForm && (
        <div className="space-y-4">
          <TestimonialForm />

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setShowForm(false)}
            className="text-sm text-gray-400 hover:text-white underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
