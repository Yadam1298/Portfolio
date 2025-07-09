import React, { useEffect, useState, useMemo } from 'react';
import { SiWhatsapp, SiGmail } from 'react-icons/si';
import { FaGithub } from 'react-icons/fa';
import { GrLinkedin } from 'react-icons/gr';
import axios from 'axios';
import './home.css';

const Home = () => {
  const [data, setData] = useState(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });
  }, []);

  useEffect(() => {
    axios
      .get('https://portfolio-server-k361.onrender.com/api/homepage')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Error fetching home data', err));
  }, []);

  const roles = useMemo(() => data?.roles || [], [data]);

  useEffect(() => {
    if (!roles.length) return;
    const interval = setInterval(() => {
      setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [roles]);

  if (!data)
    return (
      <div className="home-container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-profile-circle-container">
          <img
            className="home-profile-pic"
            src={data.profilePicUrl}
            alt="Profile"
            loading="lazy"
          />
        </div>
        <div className="home-header-text">
          <h1 className="home-gradient-name" title={data.name}>
            {data.name}
          </h1>
          <div className="home-wrapper">
            <div className="home-static-box">{roles[roleIndex]}</div>
            <div className="home-moving-box"></div>
          </div>
        </div>
      </header>

      <div className="home-neon-separator" />

      <section className="home-about-section">
        <h2 className="home-section-title">About Me</h2>
        <p className="home-about-text">{data.about}</p>
        <button className="home-resume-btn" onClick={() => setModalOpen(true)}>
          View Resume
        </button>
      </section>

      {modalOpen && (
        <div className="home-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="home-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="home-model-head">
              <h2 className="home-modal-title">My Resume</h2>
              <button
                className="home-close-btn"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <iframe
              src={data.resumeLink}
              title="Resume"
              className="home-resume-frame"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      )}

      <div className="home-neon-separator" />

      <section className="home-contact-section">
        <h2 className="home-section-title">Contact Me</h2>
        <div className="home-contact-icons">
          <a
            href={`mailto:${data.contacts.email}`}
            className="home-icon"
            title="Email"
          >
            <SiGmail />
            <span className="home-tooltip">{data.contacts.email}</span>
          </a>
          <a
            href={data.contacts.github}
            className="home-icon"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <FaGithub />
            <span className="home-tooltip">{data.contacts.github}</span>
          </a>
          <a
            href={data.contacts.linkedin}
            className="home-icon"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <GrLinkedin />
            <span className="home-tooltip">{data.contacts.linkedin}</span>
          </a>
          <a
            href={data.contacts.whatsapp}
            className="home-icon"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
          >
            <SiWhatsapp />
            <span className="home-tooltip">{data.contacts.whatsapp}</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
