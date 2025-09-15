import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios'; // ✅ use global axios instance
import './about.css';

const AboutMe = () => {
  const [data, setData] = useState({ name: '', about: '', sections: [] });

  useEffect(() => {
    axios
      .get('/api/about')
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    document.title = "About Me | Yadam's Portfolio";
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
      </div>
    </div>
  );
};

export default AboutMe;
