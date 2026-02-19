'use client';

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
];

export function BeforeAfterSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Avant / Après : nos réalisations
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Glissez le curseur pour découvrir la transformation de ces espaces verts
          par notre équipe.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <BeforeAfterSlider key={i} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
