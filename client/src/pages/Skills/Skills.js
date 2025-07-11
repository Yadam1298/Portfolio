import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './skills.css';

const Skills = () => {
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Skills | Yadam's Portfolio";
  }, []);

  useEffect(() => {
    axios
      .get('https://portfolio-server-k361.onrender.com/api/skills')
      .then((res) => {
        setSkillsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch skills:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="skills-page">
      <h1 className="skills-title">My Technical Skills</h1>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        skillsData.map((section, i) => (
          <div className="skill-category" key={i}>
            <h2 className="category-title">{section.category}</h2>
            {section.skills.map((skill, j) => (
              <div className="skill-bar-container" key={j}>
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percent">{skill.percent}%</span>
                  <span className="skill-note">{skill.note}</span>
                </div>
                <div
                  className="progress-track"
                  style={{ '--percent': `${skill.percent}%` }}
                >
                  <div className="progress-base"></div>
                  <div className="progress-hover"></div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Skills;
