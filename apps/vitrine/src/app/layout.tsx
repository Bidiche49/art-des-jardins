import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/Analytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = 'https://art-et-jardin.fr';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16a34a',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Art & Jardin - Paysagiste Angers | Amenagement, Entretien, Elagage',
    template: '%s | Art & Jardin',
  },
  description:
    'Paysagiste professionnel a Angers et Maine-et-Loire. Amenagement de jardins, entretien, elagage, abattage. Plus de 10 ans d\'experience. Devis gratuit sous 48h.',
  keywords: [
    'paysagiste angers',
    'jardinier angers',
    'entretien jardin angers',
    'elagage angers',
    'abattage arbre angers',
    'amenagement jardin angers',
    'paysagiste 49',
    'jardinier maine-et-loire',
  ],
  authors: [{ name: 'Art & Jardin' }],
  creator: 'Art & Jardin',
  publisher: 'Art & Jardin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Art & Jardin',
    title: 'Art & Jardin - Paysagiste Angers',
    description:
      'Paysagiste professionnel a Angers. Amenagement, entretien, elagage, abattage. Devis gratuit.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Art & Jardin - Paysagiste Angers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Art & Jardin - Paysagiste Angers',
    description: 'Paysagiste professionnel a Angers. Devis gratuit.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'votre-code-verification-google',
  },
  category: 'business',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Analytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
