import { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/lib/blog-data';
import { HeroSection } from '@/components/ui/HeroSection';

export const metadata: Metadata = {
  title: 'Conseils Jardinage - Blog Paysagiste | Art des Jardins Angers',
  description:
    'Conseils de jardinage par des professionnels : élagage, entretien, aménagement, réglementation. Guides pratiques pour votre jardin à Angers et en Anjou.',
  openGraph: {
    title: 'Conseils Jardinage - Art des Jardins',
    description: 'Guides et conseils de jardinage par des paysagistes professionnels.',
    type: 'website',
  },
};

export default function ConseilsPage() {
  return (
    <>
      <HeroSection
        imageSlug="creation-2"
        title="Conseils jardinage"
        subtitle="Guides pratiques et astuces de professionnels pour entretenir et sublimer votre jardin."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Conseils' },
        ]}
      />

      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/conseils/${article.slug}/`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={`/images/realisations/${article.imageSlug}-800w.webp`}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">{article.readTime} min de lecture</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">Besoin d&apos;un conseil personnalisé ?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Nos paysagistes se déplacent gratuitement pour étudier votre jardin
            et vous proposer des solutions adaptées.
          </p>
          <Link href="/contact/" className="btn-primary">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
