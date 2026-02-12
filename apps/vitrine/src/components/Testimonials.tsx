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
    text: 'Excellent travail pour l\'amenagement de notre jardin. L\'equipe a su comprendre nos attentes et proposer des solutions creatives. Le resultat depasse nos esperances. Je recommande vivement Art des Jardins !',
    service: 'Amenagement de jardin',
    date: '2025-11-15',
  },
  {
    name: 'Pierre L.',
    location: 'Avrille',
    rating: 5,
    text: 'Intervention rapide et professionnelle pour l\'elagage de nos vieux chenes. Les elagueurs sont competents et soigneux. Le chantier a ete laisse propre. Tres satisfait du resultat.',
    service: 'Elagage',
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
    location: 'Les Ponts-de-Ce',
    rating: 5,
    text: 'Abattage d\'un grand sapin devenu dangereux. Travail effectue avec beaucoup de professionnalisme malgre la difficulte (proximite de la maison). Prix correct et equipe sympathique.',
    service: 'Abattage',
    date: '2025-08-05',
  },
  {
    name: 'Isabelle B.',
    location: 'Saint-Barthelemy-d\'Anjou',
    rating: 5,
    text: 'Creation d\'une terrasse en bois et amenagement des massifs autour. Le paysagiste a ete de bon conseil sur le choix des plantes. Tres belle realisation, on profite enfin de notre jardin !',
    service: 'Amenagement de jardin',
    date: '2025-07-20',
  },
  {
    name: 'Michel G.',
    location: 'Trelaze',
    rating: 4,
    text: 'Bonne prestation pour la taille de ma haie de thuyas et l\'entretien general du jardin. Equipe ponctuelle et travail soigne. Je ferai appel a eux a nouveau.',
    service: 'Entretien de jardin',
    date: '2025-06-30',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
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
            La satisfaction de nos clients est notre priorite. Decouvrez leurs temoignages sur nos
            prestations de paysagisme, entretien, elagage et abattage.
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
              <p className="text-gray-600 mb-4 line-clamp-4">{testimonial.text}</p>
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
            Vous aussi, faites confiance a Art des Jardins pour vos espaces verts.
          </p>
          <a href="/contact/" className="btn-primary">
            Demander un devis gratuit
          </a>
        </div>
      </div>
    </section>
  );
}
