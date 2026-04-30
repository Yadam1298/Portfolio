'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Animation from '@/app/components/Animation';

export default function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/about');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) return <Animation />;

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center text-red-400">
        Failed to load data
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden px-6 md:px-20 pt-32 pb-20">
      {/* 🌌 ANIMATED BACKGROUND */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full top-[-120px] left-[-120px]" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full bottom-[-120px] right-[-120px]" />
      </motion.div>

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="relative text-center mb-24"
      >
        {data.profileImage && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-40 h-40 mx-auto rounded-full p-1 bg-gradient-to-tr from-purple-500 to-blue-500 shadow-[0_0_80px_#a855f7]"
          >
            <img
              src={data.profileImage}
              className="w-full h-full rounded-full object-cover border-4 border-black"
              alt="profile"
            />
          </motion.div>
        )}

        <h1 className="text-4xl md:text-6xl font-extrabold mt-8 tracking-tight">
          {data.title || 'About Me'}
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto mt-5 text-sm md:text-base leading-relaxed">
          {data.description}
        </p>
      </motion.section>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-10 relative z-10">
        {[
          {
            title: 'Personal Info',
            content: (
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="text-white">Nationality:</span>{' '}
                  {data.nationality}
                </p>
                <p>
                  <span className="text-white">Birth Date:</span>{' '}
                  {data.birthDate
                    ? new Date(data.birthDate).toDateString()
                    : 'N/A'}
                </p>
              </div>
            ),
          },

          {
            title: 'Skills',
            content: (
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ),
          },

          {
            title: 'Education',
            content: (
              <div className="space-y-4">
                {data.education?.map((edu, i) => (
                  <div key={i} className="border-l-2 border-purple-500 pl-4">
                    <p className="font-semibold">{edu.level}</p>
                    <p className="text-gray-400 text-sm">{edu.schoolName}</p>
                    <p className="text-xs text-gray-500">
                      {edu.department} • {edu.score}
                    </p>
                  </div>
                ))}
              </div>
            ),
          },

          {
            title: 'Interests & Hobbies',
            content: (
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <p className="text-white mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {data.interests?.map((item, i) => (
                      <span key={i}>• {item}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white mb-2">Hobbies</p>
                  <div className="flex flex-wrap gap-2">
                    {data.hobbies?.map((item, i) => (
                      <span key={i}>• {item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ),
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveCard(activeCard === index ? null : index)}
            className={`relative rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 cursor-pointer
              ${
                activeCard === index
                  ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_40px_#a855f7]'
                  : 'bg-white/5 border-white/10'
              }`}
          >
            {/* glow effect on active */}
            {activeCard === index && (
              <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-2xl -z-10" />
            )}

            <h2 className="text-lg font-semibold text-purple-400 mb-4">
              {card.title}
            </h2>

            {card.content}
          </motion.div>
        ))}
      </div>
    </main>
  );
}
