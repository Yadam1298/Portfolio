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
    }, 3000);

    const removeTimer = setTimeout(() => {
      setShowAnimation(false); // remove completely
    }, 6000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [location.pathname]);

  return (
    <>
      {/* Animation OVERLAY */}
      {showAnimation && (
        <div className="global-animation-overlay">
          <Animation fadeOut={triggerFade} />
        </div>
      )}

      {/* Site Content */}
      <Nav />
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
