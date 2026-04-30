// app/(public)/contact/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiMessageCircle,
} from 'react-icons/fi';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiSend } from 'react-icons/bi';
import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch('/api/contact');

        if (!res.ok) {
          console.warn('Contact API failed:', res.status);
          return;
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        setContactInfo(data);
      } catch (err) {
        console.error('Error fetching contact info:', err);
      }
    };

    fetchContact();
  }, []);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed');

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 mt-[55px]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* LEFT - YOUR DETAILS FIRST */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Let’s Connect
          </h1>

          <p className="text-gray-400">
            Feel free to reach out. I usually respond within 24 hours.
          </p>

          {/* CONTACT CARD */}
          <div className="space-y-4">
            {/* Email */}
            {contactInfo?.email && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex gap-4 items-center">
                <MdEmail className="text-purple-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p>{contactInfo.email}</p>
                </div>
              </div>
            )}

            {/* Phone */}
            {contactInfo?.phone && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex gap-4 items-center">
                <MdPhone className="text-pink-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p>{contactInfo.phone}</p>
                </div>
              </div>
            )}

            {/* Address */}
            {contactInfo?.address && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex gap-4 items-center">
                <MdLocationOn className="text-red-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p>{contactInfo.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* SOCIAL */}
          <div className="flex gap-4 pt-4">
            {contactInfo?.socialLinks?.github && (
              <a href={contactInfo.socialLinks.github} target="_blank">
                <FaGithub className="text-xl hover:text-purple-400" />
              </a>
            )}
            {contactInfo?.socialLinks?.linkedin && (
              <a href={contactInfo.socialLinks.linkedin} target="_blank">
                <FaLinkedin className="text-xl hover:text-blue-400" />
              </a>
            )}
            {contactInfo?.socialLinks?.twitter && (
              <a href={contactInfo.socialLinks.twitter} target="_blank">
                <FaTwitter className="text-xl hover:text-sky-400" />
              </a>
            )}
            {contactInfo?.socialLinks?.whatsapp && (
              <a href={contactInfo.socialLinks.whatsapp} target="_blank">
                <FaWhatsapp className="text-xl hover:text-green-400" />
              </a>
            )}
          </div>
        </motion.div>

        {/* RIGHT - FORM */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-semibold mb-6">Send Message</h2>

          <AnimatePresence>
            {submitted && (
              <motion.div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg flex gap-2 items-center">
                <FiCheckCircle />
                Message sent successfully!
              </motion.div>
            )}

            {error && (
              <motion.div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex gap-2 items-center">
                <FiAlertCircle />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-zinc-800 rounded-lg"
              required
            />

            <input
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-zinc-800 rounded-lg"
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-zinc-800 rounded-lg"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-zinc-800 rounded-lg"
              required
            />

            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <BiSend />
              )}
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
