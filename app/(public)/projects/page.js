'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  FiGithub,
  FiVideo,
  FiFileText,
  FiCalendar,
  FiAward,
} from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    type: '',
    src: '',
    title: '',
  });

  const [activeCard, setActiveCard] = useState(null);
  const containerRef = useRef(null);

  // ✅ Outside click reset
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
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, iRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/internships'),
      ]);

      if (!pRes.ok || !iRes.ok) throw new Error('API error');

      setProjects(await pRes.json());
      setInternships(await iRes.json());
    } catch (err) {
      console.error(err);
      setProjects([]);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, src, title) => {
    setModalContent({ type, src, title });
    setModalOpen(true);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      return `https://www.youtube.com/embed/${url.split('/').pop()}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-14">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          My Work
        </h1>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2 rounded-full border transition ${
              activeTab === 'projects'
                ? 'bg-purple-600 border-purple-500'
                : 'border-gray-600'
            }`}
          >
            Projects
          </button>

          <button
            onClick={() => setActiveTab('internships')}
            className={`px-5 py-2 rounded-full border transition ${
              activeTab === 'internships'
                ? 'bg-purple-600 border-purple-500'
                : 'border-gray-600'
            }`}
          >
            Internships
          </button>
        </div>
      </div>

      {/* GRID */}
      <div ref={containerRef} className="grid md:grid-cols-3 gap-6">
        {/* ================= PROJECTS ================= */}
        {activeTab === 'projects' &&
          projects.map((p, i) => {
            const id = p._id || i;

            return (
              <div
                key={id}
                onClick={() => setActiveCard(activeCard === id ? null : id)}
                className="relative h-[320px] rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer"
              >
                {/* FRONT */}
                <div
                  className={`absolute inset-0 p-5 flex flex-col justify-center items-center text-center transition-all duration-700
                  ${
                    activeCard === id
                      ? '-translate-y-full opacity-0'
                      : 'translate-y-0 opacity-100'
                  }`}
                >
                  <h3 className="text-xl font-bold">{p.projectTitle}</h3>
                  <p className="text-gray-400 mt-2 text-sm">{p.description}</p>

                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {(p.technologies || []).slice(0, 4).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BACK */}
                <div
                  className={`absolute inset-0 p-5 flex flex-col justify-center items-center text-center transition-all duration-700
                  ${
                    activeCard === id
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-full opacity-0'
                  }`}
                >
                  <div className="flex flex-col gap-3 w-full">
                    {p.gitrepoLink && (
                      <a
                        href={p.gitrepoLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
                      >
                        <FiGithub /> GitHub
                      </a>
                    )}

                    {p.abstractLink && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('pdf', p.abstractLink, p.projectTitle);
                        }}
                        className="flex items-center justify-center gap-2 border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
                      >
                        <FiFileText /> Abstract
                      </button>
                    )}

                    {p.liveDemoVideoLink && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(
                            'video',
                            p.liveDemoVideoLink,
                            p.projectTitle,
                          );
                        }}
                        className="flex items-center justify-center gap-2 border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
                      >
                        <FiVideo /> Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {/* ================= INTERNSHIPS ================= */}
        {activeTab === 'internships' &&
          internships.map((i, idx) => {
            const id = i._id || idx;

            return (
              <div
                key={id}
                onClick={() => setActiveCard(activeCard === id ? null : id)}
                className="relative h-[320px] rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer"
              >
                {/* FRONT */}
                <div
                  className={`absolute inset-0 p-5 flex flex-col justify-center items-center text-center transition-all duration-700
                  ${
                    activeCard === id
                      ? '-translate-y-full opacity-0'
                      : 'translate-y-0 opacity-100'
                  }`}
                >
                  <h3 className="text-xl font-bold">{i.company}</h3>
                  <p className="text-purple-400">{i.role}</p>

                  <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                    <FiCalendar /> {i.duration}
                  </div>

                  <p className="text-sm text-gray-400 mt-3">{i.description}</p>
                </div>

                {/* BACK */}
                <div
                  className={`absolute inset-0 p-5 flex flex-col justify-center items-center text-center transition-all duration-700
                  ${
                    activeCard === id
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-full opacity-0'
                  }`}
                >
                  {i.certificateLink && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(
                          'pdf',
                          i.certificateLink,
                          `${i.company} Certificate`,
                        );
                      }}
                      className="flex items-center gap-2 border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
                    >
                      <FiAward /> View Certificate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-zinc-900 w-[90%] max-w-4xl p-4 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-3">
                <h2>{modalContent.title}</h2>
                <button onClick={() => setModalOpen(false)}>✖</button>
              </div>

              {modalContent.type === 'pdf' ? (
                <iframe src={modalContent.src} className="w-full h-[70vh]" />
              ) : (
                <iframe
                  src={getYouTubeEmbedUrl(modalContent.src)}
                  className="w-full h-[70vh]"
                />
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
