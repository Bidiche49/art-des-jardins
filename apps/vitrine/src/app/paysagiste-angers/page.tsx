import { Metadata } from 'next';
import Link from 'next/link';
import { LocalBusinessCitySchema } from '@/components/seo/LocalBusinessCitySchema';
import { cities, serviceTypes } from '@/lib/cities-data';

const service = serviceTypes.find((s) => s.service === 'paysagiste')!;
const city = cities.find((c) => c.slug === 'angers')!;

export const metadata: Metadata = {
  title: 'Paysagiste Angers - Amenagement Jardin | Art & Jardin',
  description:
    'Paysagiste professionnel a Angers. Amenagement de jardin, terrasse, plantation, engazonnement. Plus de 10 ans d\'experience. Devis gratuit sous 48h.',
  keywords: [
    'paysagiste angers',
    'jardinier angers',
    'amenagement jardin angers',
    'creation jardin angers',
    'paysagiste 49',
  ],
  openGraph: {
    title: 'Paysagiste Angers - Art & Jardin',
    description: 'Votre paysagiste de confiance a Angers pour tous vos projets de jardin.',
    type: 'website',
  },
};

export default function PaysagisteAngersPage() {
  return (
    <>
      <LocalBusinessCitySchema
        city="Angers"
        postalCode="49000"
        service="Paysagiste"
        serviceDescription="Amenagement et creation de jardins sur mesure a Angers et ses environs."
        url="https://art-et-jardin.fr/paysagiste-angers/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Paysagiste a Angers
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl">
            Art & Jardin, votre partenaire de confiance pour l'amenagement et la creation de
            jardins a Angers et dans tout le Maine-et-Loire. Devis gratuit sous 48h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Demander un devis gratuit
            </Link>
            <a
              href="tel:+33600000000"
              className="btn-secondary border-white text-white hover:bg-white/10"
            >
              Appeler : 06 XX XX XX XX
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Votre paysagiste de confiance a Angers
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Bienvenue chez Art & Jardin, votre <strong>paysagiste a Angers</strong> depuis
                  plus de 10 ans. Notre equipe de professionnels passionnes met son expertise
                  au service de vos projets d'amenagement exterieur, qu'il s'agisse de creer
                  un jardin de A a Z ou de transformer un espace existant.
                </p>
                <p>
                  {city.description}
                </p>
                <p>
                  {city.specificContent}
                </p>
                <p>
                  Nous intervenons dans tous les quartiers d'Angers : {city.neighborhoods?.join(', ')}.
                  Notre connaissance du terrain et des reglementations locales nous permet de vous
                  proposer des solutions adaptees a votre environnement.
                </p>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos services de paysagisme a Angers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-primary-800 mb-4">Zone d'intervention</h3>
                  <p className="text-primary-700 mb-4">
                    Nous intervenons a Angers et dans un rayon de 30 km :
                  </p>
                  <ul className="space-y-2 text-primary-700 text-sm">
                    {cities.slice(0, 8).map((c) => (
                      <li key={c.slug} className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {c.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold mb-2">Devis gratuit</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Recevez une estimation personnalisee pour votre projet de jardin.
                  </p>
                  <Link href="/contact/" className="btn-primary w-full text-center block">
                    Demander un devis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir Art & Jardin ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Expertise locale',
                description: 'Plus de 10 ans d\'experience a Angers et ses environs.',
              },
              {
                icon: '🌱',
                title: 'Conseil personnalise',
                description: 'Vegetaux adaptes au climat angevin et a votre terrain.',
              },
              {
                icon: '💰',
                title: 'Devis gratuit',
                description: 'Estimation detaillee et transparente sous 48h.',
              },
              {
                icon: '✅',
                title: 'Garantie satisfaction',
                description: 'Suivi apres travaux et conseils d\'entretien inclus.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nous intervenons aussi a proximite d'Angers
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cities.slice(1).map((c) => (
              <Link
                key={c.slug}
                href={`/paysagiste-${c.slug}/`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors text-center"
              >
                <span className="font-medium text-gray-900">Paysagiste {c.name}</span>
                {c.distance && (
                  <span className="block text-sm text-gray-500 mt-1">a {c.distance}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Pret a embellir votre jardin ?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Contactez-nous pour une visite gratuite et un devis personnalise.
            Notre equipe vous repond sous 48h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Demander un devis
            </Link>
            <a
              href="tel:+33600000000"
              className="btn-secondary border-white text-white hover:bg-white/10"
            >
              06 XX XX XX XX
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
