import Link from 'next/link';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { HomeFAQ } from '@/components/HomeFAQ';
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
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Angers et 30 km</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nos services de paysagiste à Angers</h2>
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

      {/* About Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom max-w-4xl">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Art des Jardins, votre paysagiste de confiance à Angers
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="prose prose-lg text-gray-600 mx-auto">
              <p>
                Fondée par deux associés passionnés cumulant plus de <strong>16 ans d&apos;expérience</strong> dans
                l&apos;aménagement paysager, Art des Jardins est une entreprise de paysage basée aux Ponts-de-Cé,
                à proximité immédiate d&apos;Angers. Nous accompagnons particuliers, professionnels et syndics dans
                tous leurs projets d&apos;espaces verts : <Link href="/services/paysagisme/" className="text-primary-600 hover:text-primary-700">création de jardins</Link>,{' '}
                <Link href="/services/entretien-jardin/" className="text-primary-600 hover:text-primary-700">entretien régulier</Link>,{' '}
                <Link href="/services/elagage/" className="text-primary-600 hover:text-primary-700">élagage</Link> et{' '}
                <Link href="/services/abattage/" className="text-primary-600 hover:text-primary-700">abattage d&apos;arbres</Link>.
              </p>
              <p>
                Notre approche sur mesure garantit un résultat à la hauteur de vos attentes, que ce soit pour
                un petit jardin de ville ou un grand espace paysager. Chaque projet commence par une visite
                gratuite pour comprendre vos besoins, votre terrain et votre budget. Nous vous proposons ensuite
                un devis détaillé et transparent, sans mauvaise surprise.
              </p>
            </div>
          </AnimateOnScroll>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Nos réalisations d&apos;aménagement paysager</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Découvrez quelques-unes de nos réalisations à Angers et dans le Maine-et-Loire.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <PhotoGallery maxItems={8} showFilters={false} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <HomeFAQ />

      {/* Zone d'intervention */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Paysagiste à Angers et dans le Maine-et-Loire
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="prose prose-lg text-gray-600 mx-auto">
              <p>
                Nous intervenons dans un rayon de 30 km autour d&apos;Angers pour tous vos travaux de jardinage
                et d&apos;aménagement paysager. Notre zone d&apos;intervention couvre notamment :
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[
                { name: 'Angers', href: '/paysagiste-angers/' },
                { name: 'Avrillé', href: '/paysagiste-avrille/' },
                { name: 'Beaucouzé', href: '/paysagiste-beaucouze/' },
                { name: 'Bouchemaine', href: '/paysagiste-bouchemaine/' },
                { name: 'Les Ponts-de-Cé', href: '/paysagiste-les-ponts-de-ce/' },
                { name: 'Trélazé', href: '/paysagiste-trelaze/' },
                { name: 'Saint-Barthélemy-d\'Anjou', href: '/paysagiste-saint-barthelemy-anjou/' },
                { name: 'Écouflant', href: '/paysagiste-ecouflant/' },
                { name: 'Mûrs-Érigné', href: '/paysagiste-murs-erigne/' },
              ].map((city) => (
                <Link
                  key={city.name}
                  href={city.href}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:text-primary-600 hover:shadow-md transition-all border border-gray-200"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="prose prose-lg text-gray-600 mx-auto mt-6">
              <p>
                Quel que soit votre projet — entretien de jardin, création d&apos;espace vert, élagage
                ou abattage — nous nous déplaçons gratuitement pour établir un diagnostic et un devis
                personnalisé.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <img src="/images/realisations/creation-2-1200w.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
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
