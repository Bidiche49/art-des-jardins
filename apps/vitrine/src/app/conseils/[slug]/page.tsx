import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, getArticleBySlug } from '@/lib/blog-data';
import { getImage, getDefaultSrc } from '@/lib/images-manifest';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `/conseils/${params.slug}/`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: 'article',
      publishedTime: article.publishDate,
      images: [
        {
          url: getDefaultSrc(getImage(article.imageSlug)!, 1200),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

function renderContent(content: string) {
  const lines = content.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-1">
          {currentList.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-2xl font-bold mt-10 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-xl font-bold mt-8 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith('- **') || trimmed.startsWith('- ')) {
      const text = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      currentList.push(text);
    } else if (trimmed.startsWith('|')) {
      // Skip table lines for now (rendered as-is)
      flushList();
      // Collect table
      const tableLines = [trimmed];
      // Check next lines...handled inline in content
    } else {
      flushList();
      const html = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      elements.push(
        <p key={`p-${elements.length}`} dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
  }
  flushList();
  return elements;
}

export default function ArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: `https://art-et-jardin.fr${getDefaultSrc(getImage(article.imageSlug)!, 1200)}`,
    datePublished: article.publishDate,
    author: {
      '@type': 'Organization',
      name: 'Art des Jardins',
      url: 'https://art-et-jardin.fr',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Art des Jardins',
      url: 'https://art-et-jardin.fr',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://art-et-jardin.fr',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Conseils',
        item: 'https://art-et-jardin.fr/conseils/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
      },
    ],
  };

  const faqSchema =
    article.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: article.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  const otherArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article>
        {/* Hero image */}
        <div className="relative min-h-[400px] lg:min-h-[580px] overflow-hidden flex flex-col">
          <img
            src={getDefaultSrc(getImage(article.imageSlug)!, 1920)}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay-strong" />
          <div className="container-custom relative z-10 flex-1 flex flex-col justify-end py-12 lg:py-16">
            <nav className="text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/conseils/" className="hover:text-white">Conseils</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{article.title}</span>
            </nav>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-medium bg-primary-600 text-white px-2 py-1 rounded">
                {article.category}
              </span>
              <span className="text-xs text-white/70">{article.readTime} min de lecture</span>
              <span className="text-xs text-white/70">
                {new Date(article.publishDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">{article.title}</h1>
          </div>
        </div>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 prose prose-lg max-w-none text-gray-600">
                {renderContent(article.content)}

                {/* FAQ */}
                {article.faq.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
                    <div className="space-y-4 not-prose">
                      {article.faq.map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-5">
                          <h3 className="font-bold text-gray-900 mb-2">{item.question}</h3>
                          <p className="text-gray-600 text-sm">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-bold mb-2">Besoin d&apos;un professionnel ?</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Art des Jardins intervient dans toute l&apos;agglomération d&apos;Angers. Devis gratuit.
                    </p>
                    <Link href="/contact/" className="btn-primary w-full text-center block">
                      Demander un devis
                    </Link>
                    <p className="text-center text-sm text-gray-500 mt-3">
                      <a href="tel:+33781160737" className="text-primary-600 font-medium">
                        07 81 16 07 37
                      </a>
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Autres articles</h3>
                    <ul className="space-y-3">
                      {otherArticles.map((a) => (
                        <li key={a.slug}>
                          <Link
                            href={`/conseils/${a.slug}/`}
                            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                          >
                            {a.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <img src={getDefaultSrc(getImage(article.imageSlug)!, 1200)} alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay-strong" />
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Vous avez un projet ?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Nos paysagistes à Angers se déplacent gratuitement pour étudier votre projet.
          </p>
          <Link href="/contact/" className="btn-primary-light">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
