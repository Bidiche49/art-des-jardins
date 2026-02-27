import { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/lib/services-data';
import { ServiceSchema } from '@/components/seo/ServiceSchema';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { serviceCardImages, images } from '@/lib/images-manifest';
import { IconCheck, IconChevronRight } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Nos Services d\'Aménagement Paysager',
  description:
    'Découvrez tous nos services d\'aménagement paysager à Angers : création de jardin, entretien, élagage, abattage. Professionnels qualifiés, devis gratuit.',
  alternates: {
    canonical: '/services/',
  },
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
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 lg:py-24 min-h-[400px] lg:min-h-[450px] flex items-center">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const imageSlug = serviceCardImages[service.slug as keyof typeof serviceCardImages];
              return (
                <AnimateOnScroll key={service.slug} delay={i * 100} className="h-full">
                  <Link
                    href={`/services/${service.slug}/`}
                    className="service-card group flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    {imageSlug && (
                      <div className="aspect-[16/9] overflow-hidden relative">
                        {['entretien-jardin', 'taille-haies', 'debroussaillage'].includes(service.slug) && (
                          <span className="absolute top-3 left-3 z-10 bg-secondary-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                            Crédit d&apos;impôt 50&nbsp;%
                          </span>
                        )}
                        <img
                          src={`/images/realisations/${imageSlug}-800w.webp`}
                          alt={images[imageSlug]?.alt || service.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    )}
                    <div className="p-8 flex flex-col flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">
                        {service.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{service.heroSubtitle}</p>
                      <ul className="space-y-2 text-sm text-gray-500">
                        {service.features.slice(0, 4).map((feature, fi) => (
                          <li key={fi} className="flex items-center gap-2">
                            <IconCheck className="w-4 h-4 text-primary-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <span className="inline-flex items-center mt-auto pt-4 text-primary-600 font-medium group-hover:gap-2 transition-all">
                        En savoir plus
                        <IconChevronRight className="w-4 h-4 ml-1" />
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
