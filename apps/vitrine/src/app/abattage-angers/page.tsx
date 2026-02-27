import { Metadata } from 'next';
import Link from 'next/link';
import { LocalBusinessCitySchema } from '@/components/seo/LocalBusinessCitySchema';
import { cities, serviceTypes } from '@/lib/cities-data';
import { HeroSection } from '@/components/ui/HeroSection';
import { InlineGallery } from '@/components/ui/InlineGallery';
import { ogImages } from '@/lib/images-manifest';
import { IconCheck } from '@/lib/icons';

const service = serviceTypes.find((s) => s.service === 'abattage')!;
const city = cities.find((c) => c.slug === 'angers')!;

export const metadata: Metadata = {
  title: 'Abattage d\'Arbres Angers - Dessouchage | Art des Jardins',
  description:
    'Abattage d\'arbres sécurisé à Angers. Démontage technique, dessouchage, évacuation. Intervention urgence tempête. Devis gratuit.',
  keywords: [
    'abattage arbre angers',
    'dessouchage angers',
    'abattage 49',
    'coupe arbre angers',
    'abattage urgence angers',
  ],
  alternates: {
    canonical: '/abattage-angers/',
  },
  openGraph: {
    title: 'Abattage Arbres Angers - Art des Jardins',
    description: 'Service d\'abattage d\'arbres professionnel et sécurisé à Angers.',
    type: 'website',
    images: [{ url: ogImages.abattage, width: 1200, height: 630 }],
  },
};

export default function AbattageAngersPage() {
  return (
    <>
      <LocalBusinessCitySchema
        city="Angers"
        postalCode="49000"
        service="Abattage d'arbres"
        serviceDescription="Abattage sécurisé d'arbres dangereux ou gênants à Angers."
        url="https://art-et-jardin.fr/abattage-angers/"
      />

      {/* Hero */}
      <HeroSection
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Abattage Angers' },
        ]}
        imageSlug="elagage-3"
        title="Abattage d'Arbres à Angers"
        subtitle="Art des Jardins réalise l'abattage sécurisé d'arbres à Angers. Arbres dangereux, malades ou gênants : intervention professionnelle garantie."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/contact/" className="btn-primary-light">
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
                Abattage d'arbres en toute sécurité
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  L'<strong>abattage d'arbres à Angers</strong> est une opération délicate qui
                  nécessite un savoir-faire professionnel. Chez Art des Jardins, nous réalisons
                  l'abattage d'arbres dangereux, malades, morts ou gênants dans le respect des
                  normes de sécurité les plus strictes.
                </p>
                <p>
                  Chaque abattage est unique : nous évaluons systématiquement les risques avant
                  intervention. Proximité de bâtiments, lignes électriques, espace de chute...
                  Nos équipes adaptent leur méthode à chaque situation.
                </p>
                <p>
                  Nous intervenons dans tous les quartiers d'Angers : {city.neighborhoods?.join(', ')}.
                  Notre connaissance du terrain et des réglementations locales nous permet de
                  gérer les autorisations nécessaires pour les arbres en zone protégée.
                </p>
                <p>
                  Après l'abattage, nous proposons le dessouchage à la rogneuse et l'évacuation
                  complète des débris. Votre terrain est ainsi prêt pour une nouvelle plantation
                  ou un autre aménagement.
                </p>
              </div>

              <InlineGallery slugs={['elagage-2']} columns={2} />

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos méthodes d'abattage</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Abattage direct</h4>
                  <p className="text-gray-600 text-sm">
                    Pour les arbres en terrain dégagé avec espace de chute suffisant.
                    Méthode rapide et économique quand les conditions le permettent.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Démontage technique</h4>
                  <p className="text-gray-600 text-sm">
                    Pour les arbres en zone contrainte (près de bâtiments, lignes...).
                    Abattage pièce par pièce avec retenue des branches.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos prestations</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <IconCheck className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Faut-il une autorisation ?</h3>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  L'abattage d'un arbre peut nécessiter une autorisation selon votre situation :
                </p>
                <ul>
                  <li><strong>Arbre classé ou remarquable</strong> : autorisation obligatoire</li>
                  <li><strong>Zone protégée (ABF, secteur sauvegardé)</strong> : déclaration préalable</li>
                  <li><strong>PLU avec EBC (Espace Boisé Classé)</strong> : autorisation de défrichement</li>
                  <li><strong>Arbre sur terrain privé hors zone protégée</strong> : pas d'autorisation</li>
                </ul>
                <p>
                  Nous vous accompagnons dans les démarches administratives et pouvons nous
                  charger des demandes d'autorisation auprès de la mairie d'Angers.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-red-800 mb-4">Urgence abattage</h3>
                  <p className="text-red-700 mb-4">
                    Arbre tombé, dangereux après tempête ?
                    Intervention rapide pour sécuriser les lieux.
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
                  <h3 className="text-lg font-bold text-primary-800 mb-4">Inclus dans nos tarifs</h3>
                  <ul className="space-y-2 text-primary-700 text-sm">
                    <li>• Évaluation des risques</li>
                    <li>• Protection du site</li>
                    <li>• Abattage ou démontage</li>
                    <li>• Débit du bois</li>
                    <li>• Évacuation des déchets</li>
                    <li>• Nettoyage du terrain</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <img src="/images/realisations/elagage-5-1200w.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay-strong" />
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Besoin d'abattre un arbre ?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Contactez-nous pour une évaluation gratuite et un devis sur mesure.
            Intervention sécurisée garantie.
          </p>
          <Link href="/contact/" className="btn-primary-light">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
