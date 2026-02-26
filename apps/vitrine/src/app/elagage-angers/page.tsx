import { Metadata } from 'next';
import Link from 'next/link';
import { LocalBusinessCitySchema } from '@/components/seo/LocalBusinessCitySchema';
import { cities, serviceTypes } from '@/lib/cities-data';
import { HeroSection } from '@/components/ui/HeroSection';
import { InlineGallery } from '@/components/ui/InlineGallery';
import { ogImages } from '@/lib/images-manifest';
import { IconCheck } from '@/lib/icons';

const service = serviceTypes.find((s) => s.service === 'elagage')!;
const city = cities.find((c) => c.slug === 'angers')!;

export const metadata: Metadata = {
  title: 'Élagage Angers - Taille d\'Arbres Professionnel | Art des Jardins',
  description:
    'Élagueur professionnel à Angers. Taille d\'arbres, éclaircissage, taille de sécurisation, diagnostic phytosanitaire. Élagueurs certifiés. Devis gratuit.',
  keywords: [
    'élagage angers',
    'élagueur angers',
    'taille arbre angers',
    'élagage 49',
    'élagueur maine-et-loire',
  ],
  openGraph: {
    title: 'Élagage Angers - Art des Jardins',
    description: 'Service d\'élagage professionnel à Angers par des élagueurs certifiés.',
    type: 'website',
    images: [{ url: ogImages.elagage, width: 1200, height: 630 }],
  },
};

export default function ElagageAngersPage() {
  return (
    <>
      <LocalBusinessCitySchema
        city="Angers"
        postalCode="49000"
        service="Élagage"
        serviceDescription="Taille et soins des arbres par des élagueurs certifiés à Angers."
        url="https://art-et-jardin.fr/elagage-angers/"
      />

      {/* Hero */}
      <HeroSection
        imageSlug="elagage-1"
        title="Élagage à Angers"
        subtitle="Art des Jardins, élagueurs professionnels certifiés à Angers. Taille d'arbres, éclaircissage, sécurisation. Intervention rapide et devis gratuit."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Demander un devis gratuit
          </Link>
          <a
            href="tel:+33781160737"
            className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white/10"
          >
            Urgence : 07 81 16 07 37
          </a>
        </div>
      </HeroSection>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Service d'élagage professionnel à Angers
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  L'<strong>élagage à Angers</strong> est un métier qui demande expertise et savoir-faire.
                  Chez Art des Jardins, nos élagueurs certifiés interviennent sur tous types d'arbres pour
                  assurer leur bonne santé, leur sécurité et leur esthétique.
                </p>
                <p>
                  Angers et ses nombreux parcs et jardins abritent un patrimoine arboré remarquable.
                  Des platanes centenaires aux chênes majestueux, en passant par les arbres fruitiers
                  des jardins particuliers, chaque arbre mérite une attention particulière.
                </p>
                <p>
                  Notre équipe intervient dans tous les quartiers d'Angers : {city.neighborhoods?.join(', ')}.
                  Nous connaissons les réglementations locales concernant les arbres classés et les
                  zones protégées du secteur sauvegardé.
                </p>
              </div>

              <InlineGallery slugs={['elagage-2', 'elagage-4', 'elagage-5']} />

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos services d'élagage</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <IconCheck className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Quand faire élaguer vos arbres ?</h3>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  La période idéale d'élagage varie selon les espèces. En règle générale, nous
                  recommandons :
                </p>
                <ul>
                  <li><strong>Hiver (hors gel)</strong> : période idéale pour la plupart des feuillus</li>
                  <li><strong>Après floraison</strong> : pour les arbres à fleurs (cerisiers, pruniers...)</li>
                  <li><strong>Toute l'année</strong> : pour les urgences et la sécurisation</li>
                </ul>
                <p>
                  Nous vous conseillons sur la meilleure période pour intervenir sur vos arbres
                  en fonction de leur espèce et de leur état sanitaire.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-red-800 mb-4">Urgence élagage</h3>
                  <p className="text-red-700 mb-4">
                    Arbre dangereux, branche cassée, dégâts de tempête ?
                    Nous intervenons rapidement pour sécuriser les lieux.
                  </p>
                  <a
                    href="tel:+33781160737"
                    className="block w-full text-center bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Appeler l'urgence
                  </a>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold mb-2">Devis gratuit</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Évaluation sur place et devis détaillé sans engagement.
                  </p>
                  <Link href="/contact/" className="btn-primary w-full text-center block">
                    Demander un devis
                  </Link>
                </div>

                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-primary-800 mb-4">Zone d'intervention</h3>
                  <ul className="space-y-2 text-primary-700 text-sm">
                    {cities.slice(0, 6).map((c) => (
                      <li key={c.slug}>Élagage {c.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Élagage dans les communes voisines
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cities.slice(1).map((c) => (
              <Link
                key={c.slug}
                href={`/elagage-${c.slug}/`}
                className="block p-4 bg-white rounded-lg hover:bg-primary-50 transition-colors text-center shadow-sm"
              >
                <span className="font-medium text-gray-900">Élagage {c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <img src="/images/realisations/elagage-1-1200w.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay-strong" />
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Besoin d'un élagueur à Angers ?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Contactez-nous pour un diagnostic gratuit de vos arbres et un devis détaillé.
          </p>
          <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
