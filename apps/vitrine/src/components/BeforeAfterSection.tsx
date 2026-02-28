'use client';

import Link from 'next/link';
import { BeforeAfterSlider } from './ui/BeforeAfterSlider';

const projects = [
  {
    before: '/images/realisations/creation-8-avant-800w.webp',
    after: '/images/realisations/creation-8-800w.webp',
    beforeAlt: 'Parc non aménagé avec pelouse brute avant création paysagère',
    afterAlt: 'Parc aménagé avec muret en corten, escalier et terrasse en gravier',
    title: 'Aménagement d\'un parc avec muret corten et terrasse',
    location: 'Maine-et-Loire (49)',
  },
  {
    before: '/images/realisations/creation-10-avant-800w.webp',
    after: '/images/realisations/creation-10-800w.webp',
    beforeAlt: 'Jardin en friche avec végétation désordonnée avant aménagement',
    afterAlt: 'Jardin aménagé avec allée en pavés et massifs végétaux',
    title: 'Aménagement complet d\'un jardin en friche',
    location: 'Maine-et-Loire (49)',
  },
  {
    before: '/images/realisations/terrasse-1-avant-800w.webp',
    after: '/images/realisations/terrasse-1-800w.webp',
    beforeAlt: 'Spa posé sur herbe sans aménagement',
    afterAlt: 'Terrasse en bois aménagée autour du spa',
    title: 'Construction d\'une terrasse bois autour d\'un spa',
    location: 'Maine-et-Loire (49)',
  },
  {
    before: '/images/realisations/chantier-avant-1-800w.webp',
    after: '/images/realisations/chantier-apres-1-800w.webp',
    beforeAlt: 'Jardin envahi par la végétation avant débroussaillage',
    afterAlt: 'Jardin défriché et remis au propre après intervention',
    title: 'Débroussaillage et remise au propre',
    location: 'Maine-et-Loire (49)',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Réalisations avant/après - Art des Jardins',
  description: 'Découvrez nos transformations de jardins à Angers et en Maine-et-Loire.',
  numberOfItems: projects.length,
  itemListElement: projects.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.title,
  })),
};

export function BeforeAfterSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block text-secondary-500 font-semibold text-sm uppercase tracking-widest mb-3">
            Transformations
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Avant / Après
          </h2>
          <div className="w-12 h-1 bg-secondary-500 rounded-full mx-auto mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Glissez le curseur pour découvrir la transformation de ces espaces verts
            par notre équipe.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, i) => (
            <BeforeAfterSlider key={i} {...project} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/realisations/" className="btn-secondary">
            Voir toutes nos réalisations
          </Link>
        </div>
      </div>
    </section>
  );
}
