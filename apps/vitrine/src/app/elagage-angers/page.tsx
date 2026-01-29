import { Metadata } from 'next';
import Link from 'next/link';
import { LocalBusinessCitySchema } from '@/components/seo/LocalBusinessCitySchema';
import { cities, serviceTypes } from '@/lib/cities-data';

const service = serviceTypes.find((s) => s.service === 'elagage')!;
const city = cities.find((c) => c.slug === 'angers')!;

export const metadata: Metadata = {
  title: 'Elagage Angers - Taille d\'Arbres Professionnel | Art & Jardin',
  description:
    'Elagueur professionnel a Angers. Taille d\'arbres, eclaircissage, taille de securisation, haubanage. Elagueurs certifies. Devis gratuit.',
  keywords: [
    'elagage angers',
    'elagueur angers',
    'taille arbre angers',
    'elagage 49',
    'elagueur maine-et-loire',
  ],
  openGraph: {
    title: 'Elagage Angers - Art & Jardin',
    description: 'Service d\'elagage professionnel a Angers par des elagueurs certifies.',
    type: 'website',
  },
};

export default function ElagageAngersPage() {
  return (
    <>
      <LocalBusinessCitySchema
        city="Angers"
        postalCode="49000"
        service="Elagage"
        serviceDescription="Taille et soins des arbres par des elagueurs certifies a Angers."
        url="https://art-et-jardin.fr/elagage-angers/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Elagage a Angers
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl">
            Art & Jardin, elagueurs professionnels certifies a Angers. Taille d'arbres,
            eclaircissage, securisation. Intervention rapide et devis gratuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Demander un devis gratuit
            </Link>
            <a
              href="tel:+33600000000"
              className="btn-secondary border-white text-white hover:bg-white/10"
            >
              Urgence : 06 XX XX XX XX
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Service d'elagage professionnel a Angers
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  L'<strong>elagage a Angers</strong> est un metier qui demande expertise et savoir-faire.
                  Chez Art & Jardin, nos elagueurs certifies interviennent sur tous types d'arbres pour
                  assurer leur bonne sante, leur securite et leur esthetique.
                </p>
                <p>
                  Angers et ses nombreux parcs et jardins abritent un patrimoine arbore remarquable.
                  Des platanes centenaires aux chenes majestueux, en passant par les arbres fruitiers
                  des jardins particuliers, chaque arbre merite une attention particuliere.
                </p>
                <p>
                  Notre equipe intervient dans tous les quartiers d'Angers : {city.neighborhoods?.join(', ')}.
                  Nous connaissons les reglementations locales concernant les arbres classes et les
                  zones protegees du secteur sauvegarde.
                </p>
                <p>
                  Nous disposons d'un parc materiel complet : nacelles jusqu'a 25m, broyeurs, tronconneuses
                  professionnelles... Notre equipement nous permet d'intervenir sur les arbres les plus
                  imposants en toute securite.
                </p>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos services d'elagage</h3>
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

              <h3 className="text-2xl font-bold mt-12 mb-6">Quand faire elaguer vos arbres ?</h3>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  La periode ideale d'elagage varie selon les especes. En regle generale, nous
                  recommandons :
                </p>
                <ul>
                  <li><strong>Hiver (hors gel)</strong> : periode ideale pour la plupart des feuillus</li>
                  <li><strong>Apres floraison</strong> : pour les arbres a fleurs (cerisiers, pruniers...)</li>
                  <li><strong>Toute l'annee</strong> : pour les urgences et la securisation</li>
                </ul>
                <p>
                  Nous vous conseillons sur la meilleure periode pour intervenir sur vos arbres
                  en fonction de leur espece et de leur etat sanitaire.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-red-800 mb-4">Urgence elagage</h3>
                  <p className="text-red-700 mb-4">
                    Arbre dangereux, branche cassee, degats de tempete ?
                    Nous intervenons rapidement pour securiser les lieux.
                  </p>
                  <a
                    href="tel:+33600000000"
                    className="block w-full text-center bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Appeler l'urgence
                  </a>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold mb-2">Devis gratuit</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Evaluation sur place et devis detaille sans engagement.
                  </p>
                  <Link href="/contact/" className="btn-primary w-full text-center block">
                    Demander un devis
                  </Link>
                </div>

                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-primary-800 mb-4">Zone d'intervention</h3>
                  <ul className="space-y-2 text-primary-700 text-sm">
                    {cities.slice(0, 6).map((c) => (
                      <li key={c.slug}>Elagage {c.name}</li>
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
            Elagage dans les communes voisines
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cities.slice(1).map((c) => (
              <Link
                key={c.slug}
                href={`/elagage-${c.slug}/`}
                className="block p-4 bg-white rounded-lg hover:bg-primary-50 transition-colors text-center shadow-sm"
              >
                <span className="font-medium text-gray-900">Elagage {c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'un elagueur a Angers ?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Contactez-nous pour un diagnostic gratuit de vos arbres et un devis detaille.
          </p>
          <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
