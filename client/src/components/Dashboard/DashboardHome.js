import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboardHome.css';

const DashboardHome = () => {
  const [formData, setFormData] = useState({
    name: '',
    roles: '',
    about: '',
    resumeLink: '',
    profilePicUrl: '',
    contacts: {
      email: '',
      github: '',
      linkedin: '',
      whatsapp: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('https://portfolio-server-k361.onrender.com/api/homepage')
      .then((res) => {
        const data = res.data || {};

        setFormData({
          name: data.name || '',
          roles: Array.isArray(data.roles) ? data.roles.join(', ') : '',
          about: data.about || '',
          resumeLink: data.resumeLink || '',
          profilePicUrl: data.profilePicUrl || '',
          contacts: {
            email: data.contacts?.email || '',
            github: data.contacts?.github || '',
            linkedin: data.contacts?.linkedin || '',
            whatsapp: data.contacts?.whatsapp || '',
          },
        });
      })
      .catch((err) => console.error('Error fetching homepage data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('contacts.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contacts: { ...prev.contacts, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      roles: formData.roles
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
    };

    axios
      .put('https://portfolio-server-k361.onrender.com/api/homepage', payload)
      .then(() => {
        setMessage('✅ Homepage data updated successfully!');
        setTimeout(() => setMessage(''), 4000); // Clear after 4s
      })
      .catch((err) => {
        console.error('Update failed:', err);
        setMessage('❌ Update failed. See console for error.');
      });
  };

  if (loading)
    return (
      <div className="dashboard-home">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="dashboard-home">
      <h2>Edit Home Page</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Roles (comma separated)</label>
        <input
          type="text"
          name="roles"
          value={formData.roles}
          onChange={handleChange}
        />

        <label>About</label>
        <textarea
          name="about"
          rows="4"
          value={formData.about}
          onChange={handleChange}
        />

        <label>Resume Link</label>
        <input
          type="text"
          name="resumeLink"
          value={formData.resumeLink}
          onChange={handleChange}
        />

        <label>Profile Pic URL</label>
        <input
          type="text"
          name="profilePicUrl"
          value={formData.profilePicUrl}
          onChange={handleChange}
        />

        <h3>Contact Info</h3>
        <label>Email</label>
        <input
          type="email"
          name="contacts.email"
          value={formData.contacts.email}
          onChange={handleChange}
        />

        <label>GitHub</label>
        <input
          type="text"
          name="contacts.github"
          value={formData.contacts.github}
          onChange={handleChange}
        />

        <label>LinkedIn</label>
        <input
          type="text"
          name="contacts.linkedin"
          value={formData.contacts.linkedin}
          onChange={handleChange}
        />

        <label>WhatsApp</label>
        <input
          type="text"
          name="contacts.whatsapp"
          value={formData.contacts.whatsapp}
          onChange={handleChange}
        />

        <button type="submit">Update</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default DashboardHome;
