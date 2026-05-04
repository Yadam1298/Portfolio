'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function CertificationPage() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  const [activeCard, setActiveCard] = useState(null);
  const containerRef = useRef(null);

  // ✅ Outside click detection
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveCard(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      setCerts(data || []);
    } catch (err) {
      console.error('Error loading certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-16 relative overflow-hidden mt-[55px]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/20 blur-[120px] rounded-full" />
      </div>

      {/* HEADER */}
      <div className="text-center mb-14 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
        >
          Certifications & Achievements
        </motion.h1>

        <p className="text-gray-400 mt-3">
          Proof of skills, learning & professional growth
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters className="animate-spin text-purple-400 text-3xl" />
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <div
          ref={containerRef} // ✅ FIXED (only once here)
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10"
        >
          {certs.map((cert, index) => (
            <motion.div
              key={cert._id}
              onClick={() =>
                setActiveCard(activeCard === cert._id ? null : cert._id)
              }
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative h-[260px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-xl cursor-pointer"
            >
              {/* FRONT */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500
                ${
                  activeCard === cert._id
                    ? '-translate-y-full opacity-0'
                    : 'translate-y-0 opacity-100'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <img
                    src={cert.logoUrl || '/placeholder.png'}
                    alt="logo"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                <h2 className="text-lg font-semibold text-center px-4">
                  {cert.title}
                </h2>
              </div>

              {/* BACK */}
              <div
                className={`absolute inset-0 flex flex-col justify-center items-center text-center px-4 transition-all duration-500 bg-gradient-to-br from-zinc-900 to-black
                ${
                  activeCard === cert._id
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-full opacity-0'
                }`}
              >
                <p className="text-gray-300 text-sm">{cert.organization}</p>
                <p className="text-gray-500 text-xs mt-1">{cert.date}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCert(cert);
                  }}
                  className="mt-6 px-4 py-2 text-sm border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition"
                >
                  View Certificate
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && certs.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No certificates found
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[90%] h-[85%] bg-zinc-950 border border-zinc-800 rounded-xl p-4 relative"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-3 right-3 text-white border border-white/20 p-2 rounded-lg hover:bg-red-500 transition"
              >
                <FiX />
              </button>

              <h2 className="text-lg font-semibold mb-3 text-center">
                {selectedCert.title}
              </h2>

              {selectedCert.certificateLink ? (
                <iframe
                  src={selectedCert.certificateLink}
                  className="w-full h-[90%] rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-400 mt-20">
                  No certificate link available
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
