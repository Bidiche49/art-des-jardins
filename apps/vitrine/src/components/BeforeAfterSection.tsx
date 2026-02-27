'use client';

import Link from 'next/link';
import { BeforeAfterSlider } from './ui/BeforeAfterSlider';

const projects = [
  {
    before: '/images/realisations/entretien-1-800w.webp',
    after: '/images/realisations/entretien-2-800w.webp',
    beforeAlt: 'Jardin avant entretien par Art des Jardins',
    afterAlt: 'Jardin après entretien par Art des Jardins',
    title: 'Remise en état complète d\'un jardin',
    location: 'Les Ponts-de-Cé (49)',
  },
  {
    before: '/images/realisations/elagage-1-800w.webp',
    after: '/images/realisations/elagage-2-800w.webp',
    beforeAlt: 'Arbre avant élagage par Art des Jardins',
    afterAlt: 'Arbre après élagage par Art des Jardins',
    title: 'Élagage et mise en forme d\'un chêne',
    location: 'Angers (49)',
  },
  {
    before: '/images/realisations/creation-1-800w.webp',
    after: '/images/realisations/creation-2-800w.webp',
    beforeAlt: 'Terrain avant aménagement paysager',
    afterAlt: 'Jardin après aménagement par Art des Jardins',
    title: 'Création d\'un jardin contemporain',
    location: 'Avrillé (49)',
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
