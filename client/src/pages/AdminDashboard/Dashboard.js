import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardHome from '../../components/Dashboard/DashboardHome';
import DashboardAbout from '../../components/Dashboard/DashboardAbout';
import DashboardCertificates from '../../components/Dashboard/DashboardCertificates';
import DashboardContact from '../../components/Dashboard/DashboardContact';
import DashboardProject from '../../components/Dashboard/DashboardProject';
import DashboardInternships from '../../components/Dashboard/DashboardInternships';
import DashboardTestimonials from '../../components/Dashboard/DashboardTestimonials';

import './Dashboard.css';
import DashboardSkills from '../../components/Dashboard/DashboardSkills';

const initialContent = {
  home: null,
  about: '',
  certificates: 'List your certificates here...',
  projects: 'Describe your projects here...',
  skills: 'List your skills here...',
  testimonials: 'Add testimonials here...',
  internships: 'List your internships here...',
  contact: {
    title: "Yadam's Diary Lobby",
    paragraphs: [
      'Welcome, Agent. During your free hours, you may log your thoughts here.',
      'The Admin will contact you within 24 hours regarding your queries or requests. Please ensure your alias and message are clear.',
      'Remember: your entries are encrypted and confidential.',
      'Use this diary wisely to keep track of your mission logs.',
    ],
  },
  messages: [],
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [content, setContent] = useState(initialContent);
  const [isBlurred, setIsBlurred] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setPopupMessage('❌ Please login and try again');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/login');
      }, 2000);
    } else {
      setPopupMessage('✅ You are successfully logged in');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setIsBlurred(false);
      }, 2000);
    }
  }, [navigate]);

  useEffect(() => {
    if (activeSection === 'home') {
      fetch('/api/homepage')
        .then((res) => res.json())
        .then((data) =>
          setContent((prev) => ({
            ...prev,
            home: data,
          }))
        )
        .catch((err) => console.error('Failed to load home data', err));
    }
  }, [activeSection]);

  const handleChange = (e) => {
    setContent({
      ...content,
      [activeSection]: e.target.value,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardHome homeData={content.home} />;
      case 'about':
        return (
          <>
            <DashboardAbout />
            <textarea
              value={content.about}
              onChange={handleChange}
              placeholder="Write about yourself..."
              className="dashboard-textarea"
            />
          </>
        );
      case 'certificates':
        return (
          <>
            <DashboardCertificates />
            <textarea
              value={content.certificates}
              onChange={handleChange}
              placeholder="List your certificates here..."
              className="dashboard-textarea"
            />
          </>
        );
      case 'skills':
        return <DashboardSkills />;
      case 'testimonials':
        return <DashboardTestimonials />;
      case 'internships':
        return <DashboardInternships internshipsData={content.internships} />;
      case 'contact':
        return (
          <DashboardContact
            contactData={content.contact}
            messages={content.messages}
            setContactData={(newContact) =>
              setContent((prev) => ({ ...prev, contact: newContact }))
            }
            setMessages={(newMessages) =>
              setContent((prev) => ({ ...prev, messages: newMessages }))
            }
          />
        );
      case 'projects':
        return <DashboardProject />;

      default:
        return <div>Select a section to manage</div>;
    }
  };

  return (
    <>
      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
      <div className={`dashboard ${isBlurred ? 'blurred' : ''}`}>
        <aside className="sidebar">
          <h2>Dashboard</h2>
          <nav>
            <button
              className={`sidebar-btn ${
                activeSection === 'home' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('home')}
            >
              Home
            </button>
            <button
              className={`sidebar-btn ${
                activeSection === 'about' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('about')}
            >
              About
            </button>
            <button
              className={`sidebar-btn ${
                activeSection === 'certificates' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('certificates')}
            >
              Certificates
            </button>
            <button
              className={`sidebar-btn ${
                activeSection === 'skills' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('skills')}
            >
              Skills
            </button>
            <button
              className={`sidebar-btn ${
                activeSection === 'projects' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('projects')}
            >
              Projects
            </button>
            <button
              className={`sidebar-btn ${
                activeSection === 'testimonials' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('testimonials')}
            >
              Testimonials
            </button>
            <button
              className={`sidebar-btn ${
                activeSection === 'internships' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('internships')}
            >
              Internships
            </button>
            <button
              className={`sidebar-btn ${
                activeSection === 'contact' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('contact')}
            >
              Contact
            </button>
            <button className="sidebar-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </aside>
        <main className="content-area">
          <h3>
            Manage{' '}
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h3>
          {renderContent()}
        </main>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </>
  );
};

export default Dashboard;
