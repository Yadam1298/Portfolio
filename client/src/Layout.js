import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './components/Nav/Nav';
import Footer from './components/footer/Footer';
import Animation from './components/Animation/animation';

const Layout = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [triggerFade, setTriggerFade] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowAnimation(true);
    setTriggerFade(false);

    const fadeTimer = setTimeout(() => {
      setTriggerFade(true); // start fade-out
    }, 3000); // after animation plays

    const removeTimer = setTimeout(() => {
      setShowAnimation(false); // now unmount after fade
    }, 6000); // total: draw + fade duration

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [location.pathname]);

  return (
    <>
      <Nav />
      <main style={{ padding: '20px' }}>
        {showAnimation ? <Animation fadeOut={triggerFade} /> : <Outlet />}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
