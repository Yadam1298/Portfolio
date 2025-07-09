import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardProject.css';

const DashboardInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEmptyIntern = () => ({
    company: '',
    role: '',
    duration: '',
    description: '',
    certificate: '',
  });

  useEffect(() => {
    axios
      .get('https://portfolio-server-k361.onrender.com/api/internships')
      .then((res) => {
        setInternships(res.data.length ? res.data : [getEmptyIntern()]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load internships:', err);
        setLoading(false);
      });
  }, []);

  const handleInternChange = (e, i, field) => {
    const updated = [...internships];
    updated[i][field] = e.target.value;
    setInternships(updated);
  };

  const addNewInternship = () => {
    setInternships([...internships, getEmptyIntern()]);
  };

  const deleteInternship = async (id, index) => {
    if (id)
      await axios.delete(
        `https://portfolio-server-k361.onrender.com/api/internships/${id}`
      );
    const updated = [...internships];
    updated.splice(index, 1);
    setInternships(updated);
  };

  const saveChanges = async () => {
    for (let intern of internships) {
      if (intern._id) {
        await axios.put(
          `https://portfolio-server-k361.onrender.com/api/internships/${intern._id}`,
          intern
        );
      } else {
        await axios.post(
          'https://portfolio-server-k361.onrender.com/api/internships',
          intern
        );
      }
    }

    alert('✅ Internships saved!');
    const res = await axios.get(
      'https://portfolio-server-k361.onrender.com/api/internships'
    );
    setInternships(res.data);
  };

  return (
    <div className="dp-container">
      <h3 className="dp-heading">Manage Internships</h3>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <>
          {internships.map((intern, i) => (
            <div className="dp-project-card" key={i}>
              <input
                className="dp-input"
                placeholder="Company Name"
                value={intern.company}
                onChange={(e) => handleInternChange(e, i, 'company')}
              />
              <input
                className="dp-input"
                placeholder="Role"
                value={intern.role}
                onChange={(e) => handleInternChange(e, i, 'role')}
              />
              <input
                className="dp-input"
                placeholder="Duration (e.g., 3 months)"
                value={intern.duration}
                onChange={(e) => handleInternChange(e, i, 'duration')}
              />
              <textarea
                className="dp-textarea"
                placeholder="Internship Description"
                value={intern.description}
                onChange={(e) => handleInternChange(e, i, 'description')}
              />
              <input
                className="dp-input"
                placeholder="Certificate Link"
                value={intern.certificate}
                onChange={(e) => handleInternChange(e, i, 'certificate')}
              />
              <button
                className="dp-btn dp-delete-btn"
                onClick={() => deleteInternship(intern._id, i)}
              >
                🗑️ Delete Internship
              </button>
            </div>
          ))}

          <button
            className="dp-btn dp-add-project-btn"
            onClick={addNewInternship}
          >
            ➕ Add Internship
          </button>

          <button className="dp-btn dp-save-btn" onClick={saveChanges}>
            💾 Save Changes
          </button>
        </>
      )}
    </div>
  );
};

export default DashboardInternships;
