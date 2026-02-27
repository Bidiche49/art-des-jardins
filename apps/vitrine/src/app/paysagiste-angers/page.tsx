import { Metadata } from 'next';
import Link from 'next/link';
import { LocalBusinessCitySchema } from '@/components/seo/LocalBusinessCitySchema';
import { cities, serviceTypes } from '@/lib/cities-data';
import { HeroSection } from '@/components/ui/HeroSection';
import { InlineGallery } from '@/components/ui/InlineGallery';
import { ogImages } from '@/lib/images-manifest';
import { IconCheck, IconPin } from '@/lib/icons';

const service = serviceTypes.find((s) => s.service === 'paysagiste')!;
const city = cities.find((c) => c.slug === 'angers')!;

export const metadata: Metadata = {
  title: 'Paysagiste Angers - Aménagement Jardin | Art des Jardins',
  description:
    'Paysagiste professionnel à Angers. Aménagement de jardin, terrasse, plantation, engazonnement. 16 ans d\'expérience cumulée. Devis gratuit sous 48h.',
  keywords: [
    'paysagiste angers',
    'jardinier angers',
    'aménagement jardin angers',
    'création jardin angers',
    'paysagiste 49',
  ],
  alternates: {
    canonical: '/paysagiste-angers/',
  },
  openGraph: {
    title: 'Paysagiste Angers - Art des Jardins',
    description: 'Votre paysagiste de confiance à Angers pour tous vos projets de jardin.',
    type: 'website',
    images: [{ url: ogImages.paysagisme, width: 1200, height: 630 }],
  },
};

export default function PaysagisteAngersPage() {
  return (
    <>
      <LocalBusinessCitySchema
        city="Angers"
        postalCode="49000"
        service="Paysagiste"
        serviceDescription="Aménagement et création de jardins sur mesure à Angers et ses environs."
        url="https://art-et-jardin.fr/paysagiste-angers/"
      />

      {/* Hero */}
      <HeroSection
        imageSlug="creation-9"
        title="Paysagiste à Angers"
        subtitle="Art des Jardins, votre partenaire de confiance pour l'aménagement et la création de jardins à Angers et dans tout le Maine-et-Loire. Devis gratuit sous 48h."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Paysagiste Angers' },
        ]}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/contact/" className="btn-primary-light">
            Demander un devis gratuit
          </Link>
          <a
            href="tel:+33781160737"
            className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white/10"
          >
            Appeler : 07 81 16 07 37
          </a>
        </div>
      </HeroSection>

      {/* Introduction */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Votre paysagiste de confiance à Angers
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Bienvenue chez Art des Jardins, votre <strong>paysagiste à Angers</strong>.
                  Forts de 16 ans d'expérience cumulée, nos associés mettent leur savoir-faire
                  au service de vos projets d'aménagement extérieur, qu'il s'agisse de créer
                  un jardin de A à Z ou de transformer un espace existant.
                </p>
                <p>
                  {city.description}
                </p>
                <p>
                  Nous intervenons dans tous les quartiers d'Angers : {city.neighborhoods?.join(', ')}.
                  Notre connaissance du terrain et des réglementations locales nous permet de vous
                  proposer des solutions adaptées à votre environnement.
                </p>
              </div>

              <InlineGallery slugs={['creation-4', 'creation-7', 'creation-5', 'creation-8', 'creation-3', 'terrasse-2']} />

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos services d'aménagement paysager à Angers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <IconCheck className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
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
                    Nous intervenons à Angers et dans un rayon de 30 km :
                  </p>
                  <ul className="space-y-2 text-primary-700 text-sm">
                    {cities.slice(0, 8).map((c) => (
                      <li key={c.slug} className="flex items-center gap-2">
                        <IconPin className="w-4 h-4" />
                        {c.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold mb-2">Devis gratuit</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Recevez une estimation personnalisée pour votre projet de jardin.
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
            Pourquoi choisir Art des Jardins ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Expertise locale',
                description: '16 ans d\'expérience cumulée en aménagement paysager.',
              },
              {
                title: 'Conseil personnalisé',
                description: 'Végétaux adaptés au climat angevin et à votre terrain.',
              },
              {
                title: 'Devis gratuit',
                description: 'Estimation détaillée et transparente sous 48h.',
              },
              {
                title: 'Garantie satisfaction',
                description: 'Suivi après travaux et conseils d\'entretien inclus.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconCheck className="w-6 h-6 text-primary-600" />
                </div>
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
            Nous intervenons aussi à proximité d'Angers
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
                  <span className="block text-sm text-gray-500 mt-1">à {c.distance}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <img src="/images/realisations/creation-7-1200w.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay-strong" />
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Prêt à embellir votre jardin ?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Contactez-nous pour une visite gratuite et un devis personnalisé.
            Notre équipe vous répond sous 48h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact/" className="btn-primary-light">
              Demander un devis
            </Link>
            <a
              href="tel:+33781160737"
              className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white/10"
            >
              07 81 16 07 37
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
