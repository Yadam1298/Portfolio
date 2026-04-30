// components/TransitionProvider.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Animation from './Animation';

export default function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [targetPath, setTargetPath] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = useCallback(
    (href) => {
      if (href === pathname) return;

      setFadeOut(false);
      setIsTransitioning(true);
      setTargetPath(href);

      // Start fade out animation
      setTimeout(() => setFadeOut(true), 100);
    },
    [pathname],
  );

  useEffect(() => {
    // Trigger animation on initial page load
    setIsTransitioning(true);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 100);

    const resetTimer = setTimeout(() => {
      setIsTransitioning(false);
      setFadeOut(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(resetTimer);
    };
  }, []);

  useEffect(() => {
    // Intercept all link clicks
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        href.startsWith('#')
      )
        return;

      e.preventDefault();
      handleNavigation(href);
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [handleNavigation]);

  useEffect(() => {
    if (isTransitioning && fadeOut) {
      // Navigate after fade out animation completes
      const timeout = setTimeout(() => {
        if (targetPath) {
          router.push(targetPath);
        }
      }, 2000); // Match animation duration (4s draw + 2s fadeOut)

      return () => clearTimeout(timeout);
    }
  }, [isTransitioning, fadeOut, targetPath, router]);

  useEffect(() => {
    // Hide transition when route changes
    if (!isTransitioning) return;

    const resetTransition = () => {
      setIsTransitioning(false);
      setFadeOut(false);
      setTargetPath(null);
    };

    // Wait for page to load
    const timeout = setTimeout(resetTransition, 2500);
    return () => clearTimeout(timeout);
  }, [isTransitioning]);

  return (
    <>
      {isTransitioning && <Animation fadeOut={fadeOut} />}
      {children}
    </>
  );
}
