// app/layout.js
import { metadata } from './metadata';
import TransitionProvider from '@/app/components/TransitionProvider';
import './globals.css';
import Navbar from '@/app/components/Navbar';

export { metadata };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-black text-white antialiased">
        <TransitionProvider>
          <Navbar />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
