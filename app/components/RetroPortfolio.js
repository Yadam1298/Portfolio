'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaGithub, FaLinkedin, FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import {
  RiMailSendLine,
  RiDownloadCloud2Line,
  RiFocus3Line,
} from 'react-icons/ri';
import { SiGmail } from 'react-icons/si';
import { GrLinkedin } from 'react-icons/gr';
import Link from 'next/link';
import Animation from './Animation';

// --- Senior Dev Utility: Custom Magnetic Hook ---
const useMagnetic = (strength = 0.5) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      ref.current?.getBoundingClientRect() || {};
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    setPosition({
      x: (clientX - centerX) * strength,
      y: (clientY - centerY) * strength,
    });
  };

  const reset = () => setPosition({ x: 0, y: 0 });
  return { ref, position, handleMouseMove, reset };
};

export default function RetroPortfolio() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [roleIndex, setRoleIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const y1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const rotate = useTransform(smoothProgress, [0, 1], [0, 45]);

  // ================= DATA FETCHING =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/home');
        const data = await res.json();
        setHomeData(data);
      } catch (err) {
        console.error('Data Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const updateMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  // Role rotation effect
  useEffect(() => {
    if (!homeData?.aspirings?.length) return;
    const interval = setInterval(() => {
      setRoleIndex((prevIndex) => (prevIndex + 1) % homeData.aspirings.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [homeData?.aspirings]);

  if (loading) return <Animation />;

  const {
    fullName,
    description,
    pictureLink,
    resumeLink,
    socialLinks,
    aspirings,
  } = homeData;

  const currentRole = aspirings?.[roleIndex] || 'CREATIVE TECHNOLOGIST';

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay bg-[url('https://media.giphy.com/media/oEI9uWUicGv5K/giphy.gif')]" />

      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-purple-500 rounded-full pointer-events-none z-[10000] hidden md:block"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
      />

      <motion.div
        style={{ y: y1, rotate }}
        className="fixed top-20 right-[-5%] w-64 h-64 border-[1px] border-purple-900/30 rounded-full pointer-events-none"
      />
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-40 pb-20 relative z-10">
        {/* Profile and Name Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 mb-12">
          {/* Profile Circle */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="group cursor-pointer"
          >
            <motion.div
              className="bg-white w-[150px] h-[150px] md:w-[300px] md:h-[300px] rounded-[20%] border-3 border-white overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.img
                src={
                  pictureLink ||
                  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853'
                }
                alt="Profile"
                className="w-[90%] h-[90%] object-cover rounded-full border-5 border-black mx-auto mt-[5%]"
                initial={{ borderRadius: '50%' }}
                whileHover={{
                  borderRadius: '20%',
                  scale: 1.05,
                }} // desktop
                whileTap={{
                  borderRadius: '20%',
                  scale: 0.95,
                }} // mobile
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>

          {/* Name and Role */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1
              className="text-2xl md:text-3xl font-bold text-white transition-all duration-300 select-none"
              title={fullName}
            >
              {fullName || 'Modern Aesthetic'}
            </h1>

            <div className="relative inline-block overflow-hidden whitespace-nowrap mt-2 select-none">
              <div className="text-xs md:text-sm uppercase font-bold text-white tracking-[2px] pr-2.5 relative z-0">
                {currentRole}
              </div>
              <div className="absolute top-0 left-0 h-full w-full bg-black z-[1] border-l-4 border-white animate-[leftRight_3s_steps(25)_infinite_alternate,blink-cursor_0.2s_step-end_infinite]" />
            </div>
          </motion.div>
        </div>

        {/* Neon Separator */}
        <div className="w-[80%] max-w-[300px] h-[2px] mx-auto my-20 bg-gray-300 shadow-[0_0_6px_#fff,0_0_12px_#999] rounded-sm" />

        {/* About Section */}
        <div className="w-[90%] md:w-[80%] mx-auto mb-12 select-none">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
            About Me
          </h2>
          <div
            className="text-sm md:text-base text-gray-300 leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="flex justify-center mt-5">
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base border-2 border-white bg-transparent text-white rounded-md cursor-pointer transition-all duration-300 shadow-[0_0_8px_#fff,inset_0_0_10px_#999] hover:bg-white hover:text-black hover:shadow-[0_0_20px_#e6e6e6,inset_0_0_15px_#999]"
            >
              View Resume
            </button>
          </div>
        </div>

        {/* Neon Separator */}
        <div className="w-[80%] max-w-[300px] h-[2px] mx-auto my-20 bg-gray-300 shadow-[0_0_6px_#fff,0_0_12px_#999] rounded-sm" />

        {/* Contact Section */}
        <div className="w-[90%] md:w-[80%] max-w-[700px] mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
            Contact Me
          </h2>
          <div className="flex justify-center gap-8 md:gap-12 mt-4">
            {/* Email */}
            <a
              href={`mailto:${socialLinks?.mailId}`}
              className="relative text-2xl md:text-3xl text-gray-400 cursor-pointer transition-all duration-300 hover:text-white hover:shadow-[0_0_10px_#f2f2f2,0_0_20px_#fff] group"
            >
              <SiGmail />
              <span className="invisible group-hover:visible absolute bg-gray-800 text-gray-300 text-center rounded-md py-1 px-2.5 text-xs bottom-[-140%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-[0_0_5px_#ffffffaa] after:content-[''] after:absolute after:top-[-6px] after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-b-gray-800">
                {socialLinks?.mailId}
              </span>
            </a>

            {/* GitHub */}
            <a
              href={socialLinks?.github}
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-2xl md:text-3xl text-gray-400 cursor-pointer transition-all duration-300 hover:text-white hover:shadow-[0_0_10px_#f2f2f2,0_0_20px_#fff] group"
            >
              <FaGithub />
              <span className="invisible group-hover:visible absolute bg-gray-800 text-gray-300 text-center rounded-md py-1 px-2.5 text-xs bottom-[-140%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-[0_0_5px_#ffffffaa] after:content-[''] after:absolute after:top-[-6px] after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-b-gray-800">
                GitHub
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href={socialLinks?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-2xl md:text-3xl text-gray-400 cursor-pointer transition-all duration-300 hover:text-white hover:shadow-[0_0_10px_#f2f2f2,0_0_20px_#fff] group"
            >
              <GrLinkedin />
              <span className="invisible group-hover:visible absolute bg-gray-800 text-gray-300 text-center rounded-md py-1 px-2.5 text-xs bottom-[-140%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-[0_0_5px_#ffffffaa] after:content-[''] after:absolute after:top-[-6px] after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-b-gray-800">
                LinkedIn
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href={socialLinks?.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-2xl md:text-3xl text-gray-400 cursor-pointer transition-all duration-300 hover:text-white hover:shadow-[0_0_10px_#f2f2f2,0_0_20px_#fff] group"
            >
              <FaWhatsapp />
              <span className="invisible group-hover:visible absolute bg-gray-800 text-gray-300 text-center rounded-md py-1 px-2.5 text-xs bottom-[-140%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-[0_0_5px_#ffffffaa] after:content-[''] after:absolute after:top-[-6px] after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-b-gray-800">
                WhatsApp
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-[95%] md:w-[90%] lg:w-[900px] h-[85%] bg-white/20 rounded-lg flex flex-col p-3 md:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2.5">
              <h2 className="text-white font-bold text-lg md:text-xl">
                My Resume
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-transparent border-2 border-white text-white text-xl md:text-2xl font-bold px-2.5 py-1 md:px-3 md:py-1.5 cursor-pointer rounded transition-all duration-300 hover:bg-black hover:border-red-500 hover:text-red-500 hover:shadow-[0_0_20px_#000,inset_0_0_15px_#999]"
              >
                ✕
              </button>
            </div>
            <iframe
              src={resumeLink}
              title="Resume"
              className="flex-1 w-full rounded bg-white shadow-[0_0_12px_#aaa,0_0_18px_#ccc]"
              frameBorder="0"
            />
          </div>
        </div>
      )}

      {/* Add custom CSS animations */}
      <style jsx global>{`
        @keyframes leftRight {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes blink-cursor {
          0%,
          100% {
            border-left-color: white;
          }
          50% {
            border-left-color: transparent;
          }
        }

        .border-3 {
          border-width: 3px;
        }

        .border-5 {
          border-width: 5px;
        }
      `}</style>
    </main>
  );
}
