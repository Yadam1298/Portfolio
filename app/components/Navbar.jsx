'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar({ socialLinks = {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 🚨 Routes where navbar should NOT appear
  // 👉 ADD MORE ROUTES HERE if needed
  const hiddenRoutes = ['/login', '/admin'];

  // Hide navbar condition
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Certificates', href: '/certifications' },
    { name: 'Projects', href: '/projects' },
    { name: 'Testimonials', href: '/testimonials' },
  ];

  // 🔥 Active link checker
  const isActive = (href) => pathname === href;

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 flex justify-between items-center z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
        {/* LOGO */}
        <Link href="/" className="group relative cursor-pointer">
          <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              Y
            </span>
            <span className="text-purple-500">adam's</span>
          </div>

          <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 lg:gap-8 text-[11px] lg:text-[12px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-bold items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative transition-all duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:transition-all after:duration-300
                ${
                  isActive(link.href)
                    ? 'text-purple-400 after:w-full after:bg-purple-400'
                    : 'text-gray-300 hover:text-purple-400 after:w-0 after:bg-purple-400 hover:after:w-full'
                }
              `}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      <motion.div
        initial={false}
        animate={
          mobileMenuOpen
            ? { height: 'auto', opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-[72px] left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 md:hidden overflow-hidden z-40"
      >
        <div className="flex flex-col items-center gap-6 py-8 px-4">
          {/* NAV LINKS */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm uppercase tracking-[0.2em] font-semibold transition-colors
                ${
                  isActive(link.href)
                    ? 'text-purple-400'
                    : 'text-gray-300 hover:text-purple-400'
                }
              `}
            >
              {link.name}
            </Link>
          ))}

          {/* SOCIAL LINKS */}
          {socialLinks?.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-purple-400 text-sm uppercase"
            >
              Github
            </a>
          )}

          {socialLinks?.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-purple-400 text-sm uppercase"
            >
              LinkedIn
            </a>
          )}

          {socialLinks?.mailId && (
            <a
              href={`mailto:${socialLinks.mailId}`}
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            >
              Contact Me
            </a>
          )}
        </div>
      </motion.div>

      {/* ================= IMPORTANT NOTE ================= */}
      {/* 
        🚨 If you want more pages WITHOUT navbar:
        just add them here:

        const hiddenRoutes = ['/login', '/admin', '/your-new-route'];

        OR better:
        create route group in Next.js:

        app/
          (auth)/login/page.js   → no navbar
          (admin)/dashboard/page.js → no navbar
      */}
    </>
  );
}
