import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Art & Jardin - Paysagiste Angers',
    template: '%s | Art & Jardin',
  },
  description:
    'Entreprise de paysage a Angers. Amenagement de jardins, entretien, elagage, abattage. Devis gratuit.',
  keywords: [
    'paysagiste angers',
    'jardinier angers',
    'entretien jardin angers',
    'elagage angers',
    'amenagement jardin',
  ],
  authors: [{ name: 'Art & Jardin' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://art-et-jardin.fr',
    siteName: 'Art & Jardin',
    title: 'Art & Jardin - Paysagiste Angers',
    description: 'Entreprise de paysage a Angers. Devis gratuit.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
