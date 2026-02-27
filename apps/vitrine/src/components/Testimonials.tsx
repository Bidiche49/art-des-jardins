interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Marie D.',
    location: 'Angers',
    rating: 5,
    text: 'Excellent travail pour l\'aménagement de notre jardin. L\'équipe a su comprendre nos attentes et proposer des solutions créatives. Le résultat dépasse nos espérances. Je recommande vivement Art des Jardins !',
    service: 'Aménagement de jardin',
    date: '2025-11-15',
  },
  {
    name: 'Pierre L.',
    location: 'Avrillé',
    rating: 5,
    text: 'Intervention rapide et professionnelle pour l\'élagage de nos vieux chênes. Les élagueurs sont compétents et soigneux. Le chantier a été laissé propre. Très satisfait du résultat.',
    service: 'Élagage',
    date: '2025-10-28',
  },
  {
    name: 'Sophie M.',
    location: 'Bouchemaine',
    rating: 5,
    text: 'Nous avons souscrit un contrat d\'entretien annuel et c\'est un vrai bonheur. Plus besoin de se soucier de la tonte ou de la taille des haies. Le jardin est toujours impeccable.',
    service: 'Entretien de jardin',
    date: '2025-09-12',
  },
  {
    name: 'Jean-Claude R.',
    location: 'Les Ponts-de-Cé',
    rating: 5,
    text: 'Abattage d\'un grand sapin devenu dangereux. Travail effectué avec beaucoup de professionnalisme malgré la difficulté (proximité de la maison). Prix correct et équipe sympathique.',
    service: 'Abattage',
    date: '2025-08-05',
  },
  {
    name: 'Isabelle B.',
    location: 'Saint-Barthélemy-d\'Anjou',
    rating: 5,
    text: 'Création d\'une terrasse en bois et aménagement des massifs autour. Le paysagiste a été de bon conseil sur le choix des plantes. Très belle réalisation, on profite enfin de notre jardin !',
    service: 'Aménagement de jardin',
    date: '2025-07-20',
  },
  {
    name: 'Michel G.',
    location: 'Trélazé',
    rating: 4,
    text: 'Bonne prestation pour la taille de ma haie de thuyas et l\'entretien général du jardin. Équipe ponctuelle et travail soigné. Je ferai appel à eux à nouveau.',
    service: 'Entretien de jardin',
    date: '2025-06-30',
  },
];

import { IconStarFilled } from '@/lib/icons';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <IconStarFilled
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

function ReviewSchema() {
  const aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1),
    reviewCount: testimonials.length,
    bestRating: 5,
    worstRating: 1,
  };

  const reviews = testimonials.map((t) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: t.name,
    },
    datePublished: t.date,
    reviewBody: t.text,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: t.rating,
      bestRating: 5,
      worstRating: 1,
    },
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Art des Jardins',
    aggregateRating,
    review: reviews,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function Testimonials() {
  const avgRating = (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1);

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <ReviewSchema />
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que nos clients disent</h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarRating rating={5} />
            <span className="text-lg font-semibold">{avgRating}/5</span>
            <span className="text-gray-500">({testimonials.length} avis)</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            La satisfaction de nos clients est notre priorité. Découvrez leurs témoignages sur nos
            prestations d'aménagement paysager, entretien, élagage et abattage.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
                <StarRating rating={testimonial.rating} />
              </div>
              <p className="text-gray-600 mb-4 line-clamp-5 md:line-clamp-4">{testimonial.text}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-600 font-medium">{testimonial.service}</span>
                <span className="text-gray-400">
                  {new Date(testimonial.date).toLocaleDateString('fr-FR', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Vous aussi, faites confiance à Art des Jardins pour vos espaces verts.
          </p>
          <a href="/contact/" className="btn-primary">
            Demander un devis gratuit
          </a>
        </div>
      </div>
    </section>
  );
}
