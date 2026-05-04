// app/layout.js
import { metadata } from './metadata';
import TransitionProvider from '@/app/components/TransitionProvider';
import './globals.css';
import Navbar from '@/app/components/Navbar';
import Script from 'next/script';

export { metadata };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* ✅ Structured Data (SEO Boost) */}
        <Script
          id="person-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Yadam Naga Venkata Naveen Kumar',
              url: 'https://yadam.vercel.app',
              jobTitle: 'Full Stack Developer',
              sameAs: [
                'https://github.com/yadam1298',
                'https://linkedin.com/in/ynvnk',
              ],
            }),
          }}
        />
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
