import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardTestimonials.css';

const DashboardTestimonials = () => {
  const getEmptyTestimonial = () => ({
    name: '',
    message: '',
  });

  const [testimonials, setTestimonials] = useState([getEmptyTestimonial()]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://portfolio-server-k361.onrender.com/api/testimonials')
      .then((res) => {
        if (res.data.length > 0) {
          setTestimonials(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading testimonials:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e, index, field) => {
    const updated = [...testimonials];
    updated[index][field] = e.target.value;
    setTestimonials(updated);
  };

  const addTestimonial = () => {
    setTestimonials([...testimonials, getEmptyTestimonial()]);
  };

  const deleteTestimonial = async (index, id) => {
    if (id)
      await axios.delete(
        `https://portfolio-server-k361.onrender.com/api/testimonials/${id}`
      );
    const updated = [...testimonials];
    updated.splice(index, 1);
    if (updated.length === 0) updated.push(getEmptyTestimonial());
    setTestimonials(updated);
  };

  const saveTestimonials = async () => {
    try {
      for (let t of testimonials) {
        if (t._id) {
          await axios.put(
            `https://portfolio-server-k361.onrender.com/api/testimonials/${t._id}`,
            t
          );
        } else {
          await axios.post(
            'https://portfolio-server-k361.onrender.com/api/testimonials',
            t
          );
        }
      }
      const res = await axios.get(
        'https://portfolio-server-k361.onrender.com/api/testimonials'
      );
      setTestimonials(res.data);
      alert('✅ Testimonials saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('❌ Error saving testimonials');
    }
  };

  return (
    <div className="dt-container">
      <h2 className="dt-heading">Manage Testimonials</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        testimonials.map((t, i) => (
          <div className="dt-card" key={i}>
            <input
              type="text"
              className="dt-input"
              placeholder="Name"
              value={t.name}
              onChange={(e) => handleChange(e, i, 'name')}
            />
            <textarea
              className="dt-textarea"
              placeholder="Message"
              value={t.message}
              onChange={(e) => handleChange(e, i, 'message')}
            />
            <button
              className="dt-btn dt-delete-btn"
              onClick={() => deleteTestimonial(i, t._id)}
            >
              🗑️ Delete
            </button>
          </div>
        ))
      )}
      <button className="dt-btn dt-add-btn" onClick={addTestimonial}>
        ➕ Add Testimonial
      </button>
      <button className="dt-btn dt-save-btn" onClick={saveTestimonials}>
        💾 Save All
      </button>
    </div>
  );
};

export default DashboardTestimonials;
