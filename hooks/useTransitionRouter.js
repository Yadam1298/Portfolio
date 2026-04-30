// hooks/useTransitionRouter.js
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const TransitionContext = createContext({});

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const navigate = useCallback(
    (href, options = {}) => {
      if (isTransitioning) return;

      setIsTransitioning(true);

      // Show animation
      setTimeout(() => {
        router.push(href);
        // Hide animation after navigation
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2500);
      }, 100);
    },
    [router, isTransitioning],
  );

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionRouter() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      'useTransitionRouter must be used within TransitionProvider',
    );
  }
  return context;
}
