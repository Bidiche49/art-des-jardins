import { Metadata } from 'next';
import Link from 'next/link';
import { LocalBusinessCitySchema } from '@/components/seo/LocalBusinessCitySchema';
import { cities, serviceTypes } from '@/lib/cities-data';

const service = serviceTypes.find((s) => s.service === 'abattage')!;
const city = cities.find((c) => c.slug === 'angers')!;

export const metadata: Metadata = {
  title: 'Abattage d\'Arbres Angers - Dessouchage | Art des Jardins',
  description:
    'Abattage d\'arbres securise a Angers. Demontage technique, dessouchage, evacuation. Intervention urgence tempete. Devis gratuit.',
  keywords: [
    'abattage arbre angers',
    'dessouchage angers',
    'abattage 49',
    'coupe arbre angers',
    'abattage urgence angers',
  ],
  openGraph: {
    title: 'Abattage Arbres Angers - Art des Jardins',
    description: 'Service d\'abattage d\'arbres professionnel et securise a Angers.',
    type: 'website',
  },
};

export default function AbattageAngersPage() {
  return (
    <>
      <LocalBusinessCitySchema
        city="Angers"
        postalCode="49000"
        service="Abattage d'arbres"
        serviceDescription="Abattage securise d'arbres dangereux ou genants a Angers."
        url="https://art-et-jardin.fr/abattage-angers/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Abattage d'Arbres a Angers
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl">
            Art des Jardins realise l'abattage securise d'arbres a Angers.
            Arbres dangereux, malades ou genants : intervention professionnelle garantie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Demander un devis gratuit
            </Link>
            <a
              href="tel:+33781160737"
              className="btn-secondary border-white text-white hover:bg-white/10"
            >
              Urgence : 07 81 16 07 37
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
                Abattage d'arbres en toute securite
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  L'<strong>abattage d'arbres a Angers</strong> est une operation delicate qui
                  necessite un savoir-faire professionnel. Chez Art des Jardins, nous realisons
                  l'abattage d'arbres dangereux, malades, morts ou genants dans le respect des
                  normes de securite les plus strictes.
                </p>
                <p>
                  Chaque abattage est unique : nous evaluons systematiquement les risques avant
                  intervention. Proximite de batiments, lignes electriques, espace de chute...
                  Nos equipes adaptent leur methode a chaque situation.
                </p>
                <p>
                  Nous intervenons dans tous les quartiers d'Angers : {city.neighborhoods?.join(', ')}.
                  Notre connaissance du terrain et des reglementations locales nous permet de
                  gerer les autorisations necessaires pour les arbres en zone protegee.
                </p>
                <p>
                  Apres l'abattage, nous proposons le dessouchage a la rogneuse et l'evacuation
                  complete des debris. Votre terrain est ainsi pret pour une nouvelle plantation
                  ou un autre amenagement.
                </p>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos methodes d'abattage</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Abattage direct</h4>
                  <p className="text-gray-600 text-sm">
                    Pour les arbres en terrain degage avec espace de chute suffisant.
                    Methode rapide et economique quand les conditions le permettent.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Demontage technique</h4>
                  <p className="text-gray-600 text-sm">
                    Pour les arbres en zone contrainte (pres de batiments, lignes...).
                    Abattage piece par piece avec retenue des branches.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos prestations</h3>
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

              <h3 className="text-2xl font-bold mt-12 mb-6">Faut-il une autorisation ?</h3>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  L'abattage d'un arbre peut necessiter une autorisation selon votre situation :
                </p>
                <ul>
                  <li><strong>Arbre classe ou remarquable</strong> : autorisation obligatoire</li>
                  <li><strong>Zone protegee (ABF, secteur sauvegarde)</strong> : declaration prealable</li>
                  <li><strong>PLU avec EBC (Espace Boise Classe)</strong> : autorisation de defrichement</li>
                  <li><strong>Arbre sur terrain prive hors zone protegee</strong> : pas d'autorisation</li>
                </ul>
                <p>
                  Nous vous accompagnons dans les demarches administratives et pouvons nous
                  charger des demandes d'autorisation aupres de la mairie d'Angers.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-red-800 mb-4">Urgence abattage</h3>
                  <p className="text-red-700 mb-4">
                    Arbre tombe, dangereux apres tempete ?
                    Intervention rapide pour securiser les lieux.
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
                    Evaluation sur place et devis detaille sans engagement.
                  </p>
                  <Link href="/contact/" className="btn-primary w-full text-center block">
                    Demander un devis
                  </Link>
                </div>

                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-primary-800 mb-4">Inclus dans nos tarifs</h3>
                  <ul className="space-y-2 text-primary-700 text-sm">
                    <li>• Evaluation des risques</li>
                    <li>• Protection du site</li>
                    <li>• Abattage ou demontage</li>
                    <li>• Debit du bois</li>
                    <li>• Evacuation des dechets</li>
                    <li>• Nettoyage du terrain</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'abattre un arbre ?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Contactez-nous pour une evaluation gratuite et un devis sur mesure.
            Intervention securisee garantie.
          </p>
          <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
