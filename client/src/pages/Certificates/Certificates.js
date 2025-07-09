import React, { useEffect, useState } from 'react';
import './certificates.css';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    fetch('https://portfolio-server-k361.onrender.com/api/certificates')
      .then((res) => res.json())
      .then((data) => {
        setCertificates(data);
      })
      .catch((err) => {
        console.error('Failed to fetch certificates:', err);
        setCertificates([]);
      });
  }, []);

  const openModal = (cert) => {
    setSelectedCert(cert);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCert(null);
  };

  return (
    <div className="cert-section">
      <h1 className="cert-title">CERTIFICATES</h1>
      <div className="cert-grid">
        {certificates.length === 0 && <p>No certificates found.</p>}
        {certificates.map((cert, index) => (
          <div className="cert-card" key={index}>
            <img src={cert.logo} alt="logo" className="cert-logo" />
            <h3 className="cert-card-title">{cert.title}</h3>
            <p className="cert-org">{cert.organization}</p>
            <p className="cert-date">{cert.date}</p>
            <button onClick={() => openModal(cert)} className="cert-link">
              View Certificate
            </button>
          </div>
        ))}
      </div>

      {modalOpen && selectedCert && (
        <div className="cert-modal-overlay" onClick={closeModal}>
          <div
            className="cert-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-modal-header">
              <h2 className="cert-modal-title">{selectedCert.title}</h2>
              <button className="cert-modal-close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <embed
              src={selectedCert.link}
              type="application/pdf"
              className="cert-modal-pdf"
            />
            <div className="cert-modal-footer">
              <p className="cert-modal-org">{selectedCert.organization}</p>
              <p className="cert-modal-date">{selectedCert.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
