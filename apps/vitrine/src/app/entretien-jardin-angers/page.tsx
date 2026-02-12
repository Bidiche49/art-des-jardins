import { Metadata } from 'next';
import Link from 'next/link';
import { LocalBusinessCitySchema } from '@/components/seo/LocalBusinessCitySchema';
import { cities, serviceTypes } from '@/lib/cities-data';

const service = serviceTypes.find((s) => s.service === 'entretien-jardin')!;
const city = cities.find((c) => c.slug === 'angers')!;

export const metadata: Metadata = {
  title: 'Entretien de Jardin Angers - Tonte, Taille | Art des Jardins',
  description:
    'Service d\'entretien de jardin a Angers. Tonte pelouse, taille haies, desherbage, ramassage feuilles. Contrat annuel ou ponctuel. Devis gratuit.',
  keywords: [
    'entretien jardin angers',
    'jardinier angers',
    'tonte pelouse angers',
    'taille haie angers',
    'entretien jardin 49',
  ],
  openGraph: {
    title: 'Entretien Jardin Angers - Art des Jardins',
    description: 'Service d\'entretien de jardin professionnel a Angers.',
    type: 'website',
  },
};

export default function EntretienJardinAngersPage() {
  return (
    <>
      <LocalBusinessCitySchema
        city="Angers"
        postalCode="49000"
        service="Entretien de jardin"
        serviceDescription="Service d'entretien de jardin regulier a Angers : tonte, taille, desherbage."
        url="https://art-et-jardin.fr/entretien-jardin-angers/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Entretien de Jardin a Angers
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl">
            Art des Jardins assure l'entretien regulier de votre jardin a Angers.
            Tonte, taille, desherbage... Profitez d'un exterieur impeccable sans effort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Demander un devis gratuit
            </Link>
            <a
              href="tel:+33781160737"
              className="btn-secondary border-white text-white hover:bg-white/10"
            >
              Appeler : 07 81 16 07 37
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
                Un jardin impeccable toute l'annee
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  L'<strong>entretien de jardin a Angers</strong> demande une attention reguliere
                  et des gestes adaptes a chaque saison. Chez Art des Jardins, nous proposons des
                  contrats d'entretien sur mesure pour que vous puissiez profiter de votre
                  exterieur sans contrainte.
                </p>
                <p>
                  Le climat angevin, doux et humide, favorise une croissance vegetale importante.
                  Pelouses, haies, massifs... tout pousse vite et necessite un entretien regulier.
                  Notre equipe intervient selon un calendrier adapte a votre jardin et aux saisons.
                </p>
                <p>
                  Nous intervenons dans tous les quartiers d'Angers : {city.neighborhoods?.join(', ')}.
                  Que vous habitiez une maison avec un grand jardin ou un appartement avec terrasse,
                  nous adaptons nos prestations a vos besoins.
                </p>
                <p>
                  Nos jardiniers utilisent des equipements professionnels et des techniques
                  respectueuses de l'environnement. Nous privilegions le desherbage manuel et
                  les traitements biologiques pour preserver la biodiversite de votre jardin.
                </p>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos prestations d'entretien</h3>
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

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos formules d'entretien</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Contrat annuel</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Interventions regulieres toute l'annee selon un calendrier etabli ensemble.
                    Tarif degressif et priorite d'intervention.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 10 a 15 passages par an</li>
                    <li>• Tonte, taille, desherbage inclus</li>
                    <li>• Evacuation des dechets</li>
                    <li>• Conseils personnalises</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Intervention ponctuelle</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Pour un besoin specifique ou un rattrapage. Intervention rapide sur devis.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Remise en etat apres absence</li>
                    <li>• Preparation pour evenement</li>
                    <li>• Nettoyage saisonnier</li>
                    <li>• Taille exceptionnelle</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-primary-800 mb-4">Avantages contrat</h3>
                  <ul className="space-y-3 text-primary-700">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Tarif preferentiel (-15%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Priorite d'intervention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Planning fixe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Suivi personnalise</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold mb-2">Devis gratuit</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Etude personnalisee de vos besoins d'entretien.
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

      {/* CTA */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Un jardin parfait sans effort</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Confiez l'entretien de votre jardin a des professionnels.
            Premier devis gratuit et sans engagement.
          </p>
          <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
