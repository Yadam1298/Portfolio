// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home/home';
import About from './pages/About/about';
import Login from './pages/AdminLogin/Login';
import Dashboard from './pages/AdminDashboard/Dashboard';
import Certificates from './pages/Certificates/Certificates';
import ContactMe from './pages/Contact/ContactMe';
import ProjectShowcase from './pages/Projects/projects';
import Skills from './pages/Skills/Skills';
import Testimonials from './pages/Testimonials/Testimonials';
import ForgotPassword from './pages/AdminLogin/ForgotPassword';
import ResetPassword from './pages/AdminLogin/ResetPassword';
import './App.css'; // Import global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="contact" element={<ContactMe />} />
          <Route path="projects" element={<ProjectShowcase />} />
          <Route path="skills" element={<Skills />} />
          <Route path="testimonials" element={<Testimonials />} />
          {/* Admin routes */}
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Protected admin routes */}
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
