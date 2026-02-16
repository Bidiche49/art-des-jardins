import Link from 'next/link';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { Testimonials } from '@/components/Testimonials';
import { HeroSection } from '@/components/ui/HeroSection';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { StatsCounter } from '@/components/ui/StatsCounter';
import { PhotoGallery } from '@/components/ui/PhotoGallery';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { serviceCardImages } from '@/lib/images-manifest';

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />

      {/* Hero Section */}
      <HeroSection
        imageSlug="entretien-2"
        title="Votre paysagiste à Angers"
        subtitle="Aménagement de jardins, entretien, élagage et abattage. Devis gratuit sous 48h."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/contact" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Demander un devis gratuit
          </Link>
          <Link href="/services" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white/10">
            Nos services
          </Link>
        </div>
      </HeroSection>

      {/* Trust Band */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">Assurance RC Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="font-medium">16 ans d&apos;expérience</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Devis gratuit sous 48h</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">4.8/5 satisfaction client</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nos services</h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <AnimateOnScroll key={service.title} delay={i * 100}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  href={service.href}
                  imageSlug={service.imageSlug}
                />
              </AnimateOnScroll>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services/" className="btn-secondary">
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <AnimateOnScroll>
        <StatsCounter />
      </AnimateOnScroll>

      {/* Gallery Preview */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Nos réalisations</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Découvrez quelques-unes de nos réalisations à Angers et dans le Maine-et-Loire.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <PhotoGallery maxItems={8} showFilters={false} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/realisations/creation-2-1200w.webp')] bg-cover bg-center" />
        <div className="absolute inset-0 hero-overlay-strong" />
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Prêt à transformer votre jardin ?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour un devis gratuit et sans engagement. Intervention rapide dans tout
            Angers et ses environs.
          </p>
          <Link href="/contact" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Contactez-nous
          </Link>
        </div>
      </section>
    </>
  );
}

const services = [
  {
    title: 'Aménagement paysager',
    description: 'Conception et aménagement de jardins sur mesure.',
    href: '/services/paysagisme/',
    imageSlug: serviceCardImages.paysagisme,
  },
  {
    title: 'Entretien',
    description: 'Tonte, taille, désherbage et entretien régulier.',
    href: '/services/entretien-jardin/',
    imageSlug: serviceCardImages['entretien-jardin'],
  },
  {
    title: 'Élagage',
    description: 'Taille et élagage de tous types d\'arbres.',
    href: '/services/elagage/',
    imageSlug: serviceCardImages.elagage,
  },
  {
    title: 'Abattage',
    description: 'Abattage sécurisé d\'arbres dangereux ou gênants.',
    href: '/services/abattage/',
    imageSlug: serviceCardImages.abattage,
  },
];
