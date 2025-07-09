import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Toggle hamburger menu open/close
  const toggleMenu = () => setMenuOpen(prev => !prev);

  // Close menu when a nav link is clicked
  const handleLinkClick = () => setMenuOpen(false);

  // Logout handler: clear token and navigate to login
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token on logout
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Yadam's Portfolio</h1>

      <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className={`bar ${menuOpen ? 'bar1' : ''}`}></span>
        <span className={`bar ${menuOpen ? 'bar2' : ''}`}></span>
        <span className={`bar ${menuOpen ? 'bar3' : ''}`}></span>
      </button>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        {/* Navigation links */}
        <li>
          <NavLink to="/" className="nav-link" end onClick={handleLinkClick}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-link" onClick={handleLinkClick}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/certificates" className="nav-link" onClick={handleLinkClick}>
            Certificates
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="nav-link" onClick={handleLinkClick}>
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className="nav-link" onClick={handleLinkClick}>
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/skills" className="nav-link" onClick={handleLinkClick}>
            Skills
          </NavLink>
        </li>
        <li>
          <NavLink to="/testimonials" className="nav-link" onClick={handleLinkClick}>
            Testimonials
          </NavLink>
        </li>

        {/* Show logout only on /dashboard route */}
        {location.pathname === '/dashboard' && (
          <li className="nav-link logout" onClick={handleLogout}>
            Logout
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
