// app/metadata.js

export const metadata = {
  metadataBase: new URL('http://localhost:3000'), // 🔥 REQUIRED (change after deployment)

  title: {
    default: 'Yadam Naga Venkata Naveen Kumar',
    template: '%s | Naveen Kumar Portfolio',
  },

  description:
    'Professional portfolio of Yadam Naga Venkata Naveen Kumar - Full Stack Developer specializing in React, Next.js, Node.js, and modern web applications.',

  keywords: [
    'Full Stack Developer',
    'React Developer',
    'Next.js Developer',
    'Node.js Developer',
    'Portfolio',
    'Web Development',
    'Naveen Kumar',
    'Yadam Naveen Kumar',
  ],

  authors: [{ name: 'Yadam Naga Venkata Naveen Kumar' }],
  creator: 'Yadam Naga Venkata Naveen Kumar',
  publisher: 'Yadam Naga Venkata Naveen Kumar',

  openGraph: {
    title: 'Yadam Naga Venkata Naveen Kumar - Full Stack Developer',
    description:
      'Building modern web applications with cutting-edge technologies. Explore my portfolio and projects.',
    url: '/',
    siteName: 'Naveen Kumar Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Naveen Kumar Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Naveen Kumar - Full Stack Developer',
    description:
      'Professional portfolio showcasing my work as a Full Stack Developer',
    images: ['/og-image.jpg'],
    creator: '@yourtwitterhandle', // 🔥 update or remove
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'your-google-verification-code', // optional
  },

  alternates: {
    canonical: '/',
  },
};
