import { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/ui/HeroSection';
import { PhotoGallery } from '@/components/ui/PhotoGallery';
import { BeforeAfterSection } from '@/components/BeforeAfterSection';

export const metadata: Metadata = {
  title: 'Réalisations Paysagiste Angers - Avant/Après',
  description:
    'Découvrez nos réalisations en aménagement paysager, élagage, terrasses et clôtures à Angers. Photos avant/après de nos chantiers dans le Maine-et-Loire.',
  alternates: {
    canonical: '/realisations/',
  },
  openGraph: {
    title: 'Nos réalisations | Art des Jardins - Paysagiste Angers',
    description:
      'Galerie de nos projets paysagers : créations de jardins, terrasses, clôtures, élagage. Avant/après de nos interventions à Angers.',
    type: 'website',
  },
};

function Schemas() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Réalisations - Art des Jardins',
    description:
      'Galerie de réalisations paysagères à Angers : aménagement de jardins, terrasses, clôtures, élagage et abattage.',
    url: 'https://art-et-jardin.fr/realisations/',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Art des Jardins',
      url: 'https://art-et-jardin.fr/',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://art-et-jardin.fr/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Réalisations',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

export default function RealisationsPage() {
  return (
    <>
      <Schemas />

      <HeroSection
        imageSlug="creation-7"
        title="Nos réalisations"
        subtitle="Découvrez nos projets d'aménagement paysager, d'élagage et d'entretien dans l'agglomération d'Angers."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Réalisations' },
        ]}
      />

      {/* Gallery */}
      <section className="pt-8 pb-16 lg:pt-10 lg:pb-24">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Galerie de projets
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Filtrez par catégorie pour découvrir nos réalisations en création de jardin,
            terrasse, clôture, élagage et entretien.
          </p>
          <PhotoGallery showFilters={true} />
        </div>
      </section>

      {/* CTA après galerie */}
      <section className="relative py-16 overflow-hidden">
        <img
          src="/images/realisations/creation-4-1200w.webp"
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay-strong" />
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Envie d&apos;un jardin qui vous ressemble ?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Chaque projet commence par une écoute attentive de vos envies. Contactez-nous pour en discuter.
          </p>
          <Link
            href="/contact/"
            className="btn-primary-light"
          >
            Demander un devis gratuit
          </Link>
        </div>
      </section>

      {/* Before / After */}
      <BeforeAfterSection />

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <img
          src="/images/realisations/creation-9-1200w.webp"
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay-strong" />
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Votre projet peut être le prochain
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Contactez-nous pour un devis gratuit et donnons vie à votre jardin.
          </p>
          <Link
            href="/contact/"
            className="btn-primary-light"
          >
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
