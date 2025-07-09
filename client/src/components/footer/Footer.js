import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="neon-footer">
      <div className="footer-content">
        <h3 className="footer-title">Yadam's Portfolio</h3>
        <p className="footer-tagline">
          Final Year B.Tech Student | MERN Stack Developer | AI-ML Practitioner
        </p>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Naveen Kumar. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
