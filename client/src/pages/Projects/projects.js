import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './project.css';

const ProjectShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    type: '',
    src: '',
    title: '',
  });

  useEffect(() => {
    document.title = "Projects | Yadam's Portfolio";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, internRes] = await Promise.all([
          axios.get('https://portfolio-server-k361.onrender.com/api/projects'),
          axios.get(
            'https://portfolio-server-k361.onrender.com/api/internships'
          ),
        ]);
        setProjects(projRes.data);
        setInternships(internRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, []);

  const openModal = (type, src, title) => {
    setModalContent({ type, src, title });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent({ type: '', src: '', title: '' });
  };

  // ✅ Helper to convert YouTube URLs to embeddable format
  const getYouTubeEmbedUrl = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // fallback for non-YouTube URLs
    } catch (err) {
      console.error('Invalid video URL:', url);
      return '';
    }
  };

  // ✅ Helper to check if video is a YouTube URL
  const isYouTubeUrl = (url) =>
    url.includes('youtu.be') || url.includes('youtube.com');

  return (
    <div className="project-showcase">
      <h1>My Projects</h1>
      <div className="card-grid">
        {projects.map((project, i) => (
          <div className="hover-card" key={i}>
            <div className="card-front">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tags">
                {Array.from(
                  { length: Math.ceil(project.tech.length / 3) },
                  (_, rowIndex) => (
                    <div className="tag-row" key={rowIndex}>
                      {project.tech
                        .slice(rowIndex * 3, rowIndex * 3 + 3)
                        .map((tech, idx) => (
                          <span key={idx}>{tech}</span>
                        ))}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="card-back">
              <div className="btn-group">
                <a
                  href={project.view}
                  target="_blank"
                  className="btn-glow"
                  rel="noreferrer"
                >
                  View Project
                </a>
                <button
                  className="btn-glow"
                  onClick={() =>
                    openModal('pdf', project.abstract, project.title)
                  }
                >
                  View Abstract
                </button>
                <button
                  className="btn-glow"
                  onClick={() =>
                    openModal('video', project.video, project.title)
                  }
                >
                  View Deployment Video
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h1>My Internships</h1>
      <div className="card-grid">
        {internships.map((intern, i) => (
          <div className="hover-card" key={i}>
            <div className="card-front">
              <h3>{intern.company}</h3>
              <p>
                <strong>Role:</strong> {intern.role}
              </p>
              <p>
                <strong>Duration:</strong> {intern.duration}
              </p>
              <p>{intern.description}</p>
            </div>
            <div className="card-back">
              <p>
                Internship experience at <strong>{intern.company}</strong> as a{' '}
                <strong>{intern.role}</strong> for{' '}
                <strong>{intern.duration}</strong>.
              </p>
              {intern.certificate && (
                <button
                  className="btn-glow"
                  onClick={() =>
                    openModal(
                      'pdf',
                      intern.certificate,
                      `${intern.company} Certificate`
                    )
                  }
                >
                  View Certificate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="model-head">
              <h2 className="modal-title">{modalContent.title}</h2>
              <button className="modal-close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>

            {modalContent.type === 'pdf' ? (
              <embed
                src={modalContent.src}
                type="application/pdf"
                className="modal-pdf"
              />
            ) : isYouTubeUrl(modalContent.src) ? (
              <iframe
                src={getYouTubeEmbedUrl(modalContent.src)}
                className="modal-video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube Video"
              />
            ) : (
              <video
                src={modalContent.src}
                className="modal-video"
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcase;
