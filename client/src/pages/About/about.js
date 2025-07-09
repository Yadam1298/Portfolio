import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './about.css';

const AboutMe = () => {
  const [data, setData] = useState({ name: '', about: '', sections: [] });
  const [form, setForm] = useState({ name: '', aboutMe: '', sectionItem: '' });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/about')
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  const renderWithLineBreaks = (text) => {
    if (!text || typeof text !== 'string') return null;
    return text.split('\n').map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="about-bg">
      <div className="about-glass">
        <h1 className="about-header">About Me</h1>
        <p className="about-about">{renderWithLineBreaks(data.aboutMe)}</p>
        <h2 className="about-name">{data.name}</h2>

        {data.sections.map((sec, i) => (
          <div key={i} className="about-section">
            <div className="about-title">{sec.title}</div>
            <div
              className={`about-items ${
                sec.items?.length <= 3 ? 'single' : 'double'
              }`}
            >
              {(sec.items || []).map((item, j) => (
                <div key={j} className="about-item">
                  {renderWithLineBreaks(item)}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Editable Inputs Section */}
        <div className="about-section">
          <div className="about-title">Update Info</div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Your Name"
              className="about-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              placeholder="About You"
              className="about-textarea"
              value={form.aboutMe}
              onChange={(e) => setForm({ ...form, aboutMe: e.target.value })}
            ></textarea>
            <textarea
              placeholder="Section Item"
              className="about-textarea"
              value={form.sectionItem}
              onChange={(e) =>
                setForm({ ...form, sectionItem: e.target.value })
              }
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
