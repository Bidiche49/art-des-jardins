import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getServiceBySlug } from '@/lib/services-data';
import { ServiceSchema } from '@/components/seo/ServiceSchema';
import { TaxCreditSection } from '@/components/TaxCreditSection';
import { HeroSection } from '@/components/ui/HeroSection';
import { serviceCardImages, ogImages } from '@/lib/images-manifest';
import { IconCheck, IconChevronRight } from '@/lib/icons';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};

  const ogKey = service.slug === 'entretien-jardin' ? 'entretien' : service.slug;
  const ogImage = ogImages[ogKey as keyof typeof ogImages] || ogImages.default;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
  };
}

export default function ServicePage({ params }: PageProps) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <ServiceSchema
        name={service.title}
        description={service.metaDescription}
        url={`https://art-et-jardin.fr/services/${service.slug}/`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <HeroSection
        imageSlug={serviceCardImages[service.slug as keyof typeof serviceCardImages] || 'creation-2'}
        title={service.heroTitle}
        subtitle={service.heroSubtitle}
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Services', href: '/services/' },
          { label: service.shortTitle },
        ]}
      />

      {/* Description */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Notre expertise</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                {service.description.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph.trim()}</p>
                ))}
              </div>

              {/* Features */}
              <h3 className="text-2xl font-bold mt-12 mb-6">Nos prestations</h3>
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
                {/* Benefits */}
                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-primary-800 mb-4">Pourquoi nous choisir ?</h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-primary-700">
                        <IconCheck className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tarif indicatif */}
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Tarif indicatif</h3>
                  <p className="text-2xl font-bold text-amber-800 mb-2">{service.priceRange.label}</p>
                  <p className="text-xs text-amber-700">
                    Prix indicatif selon la complexité du chantier. Un devis précis et gratuit est
                    systématiquement établi avant intervention.
                  </p>
                </div>

                {/* CTA Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold mb-2">Devis gratuit</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Recevez une estimation personnalisée sous 48h.
                  </p>
                  <Link href="/contact/" className="btn-primary w-full text-center block">
                    Demander un devis
                  </Link>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Ou appelez-nous :{' '}
                    <a href="tel:+33781160737" className="text-primary-600 font-medium">
                      07 81 16 07 37
                    </a>
                    {' '}<span className="text-gray-400">|</span>{' '}
                    <a href="tel:+33659684916" className="text-primary-600 font-medium">
                      06 59 68 49 16
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credit d'impot (entretien only) */}
      {service.slug === 'entretien-jardin' && <TaxCreditSection />}

      {/* Process */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {service.process.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-xl p-6 h-full shadow-sm">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {i < service.process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <IconChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
          <div className="space-y-6">
            {service.faq.map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-16 overflow-hidden">
        <img src="/images/realisations/creation-2-1200w.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay-strong" />
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Prêt à démarrer votre projet ?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Contactez-nous pour un devis gratuit et sans engagement. Notre équipe vous répond sous
            48h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Demander un devis
            </Link>
            <a
              href="tel:+33781160737"
              className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white/10"
            >
              Appeler maintenant
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
