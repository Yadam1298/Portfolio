import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboardAbout.css';

const DashboardAbout = () => {
  const [aboutMe, setAboutMe] = useState('');
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          'https://portfolio-server-k361.onrender.com/api/about'
        );
        if (res.data && (res.data.aboutMe || res.data.sections?.length)) {
          setAboutMe(res.data.aboutMe || '');
          const preparedSections = (res.data.sections || []).map((sec) => ({
            ...sec,
            id: Date.now() + Math.random(),
            expanded: true,
          }));
          setSections(preparedSections);
        } else {
          console.log('No About data found. Showing empty form.');
        }
      } catch (err) {
        console.error('Failed to load About data', err);
      }
    };
    fetchAbout();
  }, []);

  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now(), title: '', items: [''], expanded: true },
    ]);
  };

  const deleteSection = (id) => {
    setSections(sections.filter((sec) => sec.id !== id));
  };

  const toggleSection = (id) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === id ? { ...sec, expanded: !sec.expanded } : sec
      )
    );
  };

  const handleTitleChange = (id, value) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, title: value } : sec))
    );
  };

  const addItem = (id) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === id ? { ...sec, items: [...sec.items, ''] } : sec
      )
    );
  };

  const deleteItem = (secId, itemIdx) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === secId
          ? {
              ...sec,
              items: sec.items.filter((_, i) => i !== itemIdx),
            }
          : sec
      )
    );
  };

  const handleItemChange = (secId, itemIdx, value) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === secId
          ? {
              ...sec,
              items: sec.items.map((item, i) => (i === itemIdx ? value : item)),
            }
          : sec
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalSections = sections.map(({ title, items }) => ({
      title,
      items,
    }));
    const fullData = { aboutMe, sections: finalSections };

    try {
      await axios.post(
        'https://portfolio-server-k361.onrender.com/api/about',
        fullData
      );
      setMessage('Changes saved successfully!');
    } catch (err) {
      console.error('Failed to save About info', err);
      setMessage('Failed to save. Please try again.');
    }
  };

  return (
    <div className="dashboard-about-container">
      <h2>Edit About Me</h2>

      <form onSubmit={handleSubmit} className="dashboard-about-form">
        <label className="about-label">About Me:</label>
        <textarea
          className="about-me-textarea"
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          rows={4}
          placeholder="Write a short intro about yourself..."
        />

        {sections.map((section) => (
          <div key={section.id} className="section-box">
            <div className="section-header">
              <button
                type="button"
                className="toggle-btn"
                onClick={() => toggleSection(section.id)}
              >
                {section.expanded ? '▼' : '▶'}
              </button>
              <input
                type="text"
                className="section-title-input"
                placeholder="Section Title"
                value={section.title}
                onChange={(e) => handleTitleChange(section.id, e.target.value)}
              />
              <button
                type="button"
                className="delete-section"
                onClick={() => deleteSection(section.id)}
              >
                ×
              </button>
            </div>

            {section.expanded && (
              <div className="section-items">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="item-wrapper">
                    <textarea
                      className="item-textarea"
                      placeholder={`Item ${itemIndex + 1}`}
                      value={item}
                      onChange={(e) =>
                        handleItemChange(section.id, itemIndex, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="delete-item"
                      onClick={() => deleteItem(section.id, itemIndex)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-item-btn"
                  onClick={() => addItem(section.id)}
                >
                  + Add Item
                </button>
              </div>
            )}
          </div>
        ))}

        <button type="button" className="add-section-btn" onClick={addSection}>
          + Add Section
        </button>

        <button type="submit" className="submit-btn">
          Save Changes
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default DashboardAbout;
