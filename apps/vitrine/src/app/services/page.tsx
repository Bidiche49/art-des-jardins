import { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/lib/services-data';
import { ServiceSchema } from '@/components/seo/ServiceSchema';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { serviceCardImages } from '@/lib/images-manifest';

export const metadata: Metadata = {
  title: 'Nos Services d\'Aménagement Paysager',
  description:
    'Découvrez tous nos services d\'aménagement paysager à Angers : création de jardin, entretien, élagage, abattage. Professionnels qualifiés, devis gratuit.',
  openGraph: {
    title: 'Services Paysagiste Angers | Art des Jardins',
    description: 'Aménagement, entretien, élagage, abattage - Tous nos services d\'aménagement paysager',
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServiceSchema
        name="Services d'aménagement paysager Art des Jardins"
        description="Entreprise d'aménagement paysager proposant création de jardin, entretien, élagage et abattage à Angers et environs."
        url="https://art-et-jardin.fr/services/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Services</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Art des Jardins vous accompagne dans tous vos projets d'espaces verts. De la conception à
            l'entretien, découvrez nos prestations professionnelles.
          </p>
        </div>
      </section>

      {/* Services Grid - with photos */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => {
              const imageSlug = serviceCardImages[service.slug as keyof typeof serviceCardImages];
              return (
                <AnimateOnScroll key={service.slug} delay={i * 100}>
                  <Link
                    href={`/services/${service.slug}/`}
                    className="service-card group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                  >
                    {imageSlug && (
                      <div className="aspect-[16/9] overflow-hidden relative">
                        <img
                          src={`/images/realisations/${imageSlug}-800w.webp`}
                          alt={service.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    )}
                    <div className="p-8">
                      <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">
                        {service.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{service.heroSubtitle}</p>
                      <ul className="space-y-2 text-sm text-gray-500">
                        {service.features.slice(0, 4).map((feature, fi) => (
                          <li key={fi} className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <span className="inline-flex items-center mt-4 text-primary-600 font-medium group-hover:gap-2 transition-all">
                        En savoir plus
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'un conseil ?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Vous ne savez pas quel service correspond à votre besoin ? Contactez-nous pour un
            diagnostic gratuit de votre jardin.
          </p>
          <Link href="/contact/" className="btn-primary">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
