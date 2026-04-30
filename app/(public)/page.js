// app/page.js (or your main layout wrapper)
'use client';

import TransitionProvider from '@/app/components/TransitionProvider';
import RetroPortfolio from '@/app/components/RetroPortfolio'; // Your main component

export default function Home() {
  return (
    <TransitionProvider>
      <RetroPortfolio />
    </TransitionProvider>
  );
}
