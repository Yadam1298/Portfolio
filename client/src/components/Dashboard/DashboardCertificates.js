import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboardCertificates.css';

const DashboardCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch certificates on mount
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
        'https://portfolio-server-k361.onrender.com/api/certificates'
      );
      // Add isEditing = false to each
      const certs = res.data.map((cert) => ({ ...cert, isEditing: false }));
      setCertificates(certs);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch certificates', err);
      setLoading(false);
    }
  };

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      {
        title: '',
        organization: '',
        date: '',
        link: '',
        logo: '',
        isEditing: true,
      },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...certificates];
    updated[index][field] = value;
    setCertificates(updated);
  };

  const toggleEdit = (index) => {
    const updated = [...certificates];
    updated[index].isEditing = !updated[index].isEditing;
    setCertificates(updated);
  };

  const saveCertificate = async (index) => {
    const cert = certificates[index];
    if (!cert.title || !cert.organization) {
      alert('Title and Organization are required!');
      return;
    }

    try {
      if (cert._id) {
        // Update existing certificate
        const res = await axios.put(
          `https://portfolio-server-k361.onrender.com/api/certificates/${cert._id}`,
          cert
        );
        const updated = [...certificates];
        updated[index] = { ...res.data, isEditing: false };
        setCertificates(updated);
      } else {
        // Create new certificate
        const res = await axios.post(
          'https://portfolio-server-k361.onrender.com/api/certificates',
          cert
        );
        const updated = [...certificates];
        updated[index] = { ...res.data, isEditing: false };
        setCertificates(updated);
      }
    } catch (err) {
      alert('Failed to save certificate');
      console.error(err);
    }
  };

  const deleteCertificate = async (index) => {
    const cert = certificates[index];
    if (cert._id) {
      try {
        await axios.delete(
          `https://portfolio-server-k361.onrender.com/api/certificates/${cert._id}`
        );
      } catch (err) {
        alert('Failed to delete certificate');
        console.error(err);
        return;
      }
    }
    // Remove from UI regardless
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  if (loading) return <p>Loading certificates...</p>;

  return (
    <div className="dashboard-certificates-section">
      <h2>Manage Certificates</h2>
      <button className="add-cert-btn" onClick={addCertificate}>
        + Add Certificate
      </button>

      {certificates.length === 0 && <p>No certificates added yet.</p>}

      <div className="certificates-list">
        {certificates.map((cert, index) => (
          <div className="dashboard-certificate-card" key={cert._id || index}>
            {cert.isEditing ? (
              <>
                <input
                  type="text"
                  placeholder="Title"
                  value={cert.title}
                  onChange={(e) =>
                    handleInputChange(index, 'title', e.target.value)
                  }
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={cert.organization}
                  onChange={(e) =>
                    handleInputChange(index, 'organization', e.target.value)
                  }
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Date (e.g., June 2023)"
                  value={cert.date}
                  onChange={(e) =>
                    handleInputChange(index, 'date', e.target.value)
                  }
                  className="input-field"
                />
                <input
                  type="url"
                  placeholder="Certificate Link"
                  value={cert.link}
                  onChange={(e) =>
                    handleInputChange(index, 'link', e.target.value)
                  }
                  className="input-field"
                />
                <input
                  type="url"
                  placeholder="Logo URL"
                  value={cert.logo}
                  onChange={(e) =>
                    handleInputChange(index, 'logo', e.target.value)
                  }
                  className="input-field"
                />

                <div className="btn-group">
                  <button
                    className="save-btn"
                    onClick={() => saveCertificate(index)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => toggleEdit(index)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{cert.title}</h3>
                <p>
                  <strong>Organization:</strong> {cert.organization}
                </p>
                <p>
                  <strong>Date:</strong> {cert.date}
                </p>
                <p>
                  <strong>Link:</strong>{' '}
                  {cert.link ? (
                    <a href={cert.link} target="_blank" rel="noreferrer">
                      View Certificate
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
                {cert.logo && (
                  <img
                    src={cert.logo}
                    alt="logo"
                    className="certificate-logo-preview"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                )}

                <div className="btn-group">
                  <button
                    className="edit-btn"
                    onClick={() => toggleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteCertificate(index)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCertificates;
