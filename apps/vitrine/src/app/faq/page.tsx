import { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/ui/HeroSection';
import { FAQContent } from './faq-content';

export const metadata: Metadata = {
  title: 'FAQ Paysagiste Angers - Questions Réponses',
  description:
    'Toutes les réponses à vos questions sur nos services de paysagisme, entretien de jardin, élagage et abattage à Angers. Devis, tarifs, zones d\'intervention, crédit d\'impôt.',
  alternates: {
    canonical: '/faq/',
  },
  openGraph: {
    title: 'FAQ - Questions fréquentes | Art des Jardins',
    description:
      'Trouvez les réponses à toutes vos questions sur nos services de paysagiste à Angers et environs.',
    type: 'website',
  },
};

export default function FAQPage() {
  return (
    <>
      <HeroSection
        imageSlug="creation-2"
        title="Questions fréquentes"
        subtitle="Trouvez les réponses à toutes vos questions sur nos services de paysagiste à Angers et environs."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'FAQ' },
        ]}
      />

      <FAQContent />

      {/* CTA */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Contactez-nous directement, nous répondons à toutes vos questions
            sous 48h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+33781160737" className="btn-primary">
              Appeler le 07 81 16 07 37
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              Envoyer un message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
