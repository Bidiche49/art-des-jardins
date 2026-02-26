import Link from 'next/link';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { HomeFAQ } from '@/components/HomeFAQ';
import { HeroSection } from '@/components/ui/HeroSection';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { StatsCounter } from '@/components/ui/StatsCounter';
import { PhotoGallery } from '@/components/ui/PhotoGallery';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { BeforeAfterSection } from '@/components/BeforeAfterSection';
import { serviceCardImages, getSrcSet, getDefaultSrc, getImage } from '@/lib/images-manifest';
import { IconRcPro, IconDecennale, IconExperience, IconDevis48h, IconZone30km, IconInstagram, IconEuro } from '@/lib/icons';

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />

      {/* Hero Section */}
      <HeroSection
        imageSlug="entretien-2"
        title="Votre paysagiste à Angers"
        subtitle="Aménagement de jardins, entretien, élagage et abattage. Devis gratuit sous 48h suite au rendez-vous."
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
              <IconRcPro className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="font-medium">Assurance RC Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <IconDecennale className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="font-medium">Assurance décennale</span>
            </div>
            <div className="flex items-center gap-2">
              <IconExperience className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="font-medium">16 ans d&apos;expérience</span>
            </div>
            <div className="flex items-center gap-2">
              <IconDevis48h className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="font-medium">Devis gratuit sous 48h suite au rendez-vous</span>
            </div>
            <div className="flex items-center gap-2">
              <IconZone30km className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="font-medium">Angers et 30 km</span>
            </div>
            <div className="flex items-center gap-2">
              <IconEuro className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="font-medium">Crédit d&apos;impôt 50 %</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="pt-10 pb-16 lg:pt-14 lg:pb-24 bg-gray-50">
        <div className="container-custom">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nos services de paysagiste à Angers</h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {services.map((service, i) => (
              <AnimateOnScroll key={service.title} delay={i * 100} className="h-full">
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  href={service.href}
                  imageSlug={service.imageSlug}
                  badge={service.badge}
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

      {/* Tax Credit Accent */}
      <section className="py-3 bg-primary-50 border-y border-primary-100">
        <div className="container-custom">
          <Link
            href="/services/entretien-jardin/"
            className="flex items-center justify-center gap-2 text-sm text-primary-800 hover:text-primary-900 transition-colors"
          >
            <IconEuro className="w-4 h-4 text-primary-600 hidden sm:block" />
            <span>Entretien de jardin — Bénéficiez de <strong>50 % de crédit d&apos;impôt</strong></span>
            <span className="text-primary-600" aria-hidden="true">&rarr;</span>
          </Link>
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
            <PhotoGallery
              maxItems={8}
              showFilters={false}
              excludeSlugs={[
                'entretien-2', // hero
                'creation-9', 'entretien-3', 'elagage-2', 'elagage-1', // service cards
                'entretien-1', 'creation-1', 'creation-2', 'chantier-avant-1', 'chantier-apres-1', // avant/après
                'creation-6', // chantier non fini
                'terrasse-2', // utilisée section zones
              ]}
            />
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="text-center mt-8">
              <a
                href="https://www.instagram.com/artdesjardins_49"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <IconInstagram className="w-5 h-5" />
                Découvrez plus de réalisations sur Instagram
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Avant / Après */}
      <BeforeAfterSection />

      {/* FAQ */}
      <HomeFAQ />

      {/* Zone d'intervention */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom max-w-5xl">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Paysagiste à Angers et dans le Maine-et-Loire
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
              <div className="prose prose-lg text-gray-600">
                <p>
                  Nous intervenons dans un rayon de 30 km autour d&apos;Angers pour tous vos travaux de jardinage
                  et d&apos;aménagement paysager. Notre zone d&apos;intervention couvre notamment :
                </p>
                <p>
                  Intervention possible hors département pour les projets d&apos;envergure.
                </p>
              </div>
              {(() => {
                const zoneImage = getImage('terrasse-2');
                if (!zoneImage) return null;
                return (
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <picture>
                      <source type="image/webp" srcSet={getSrcSet(zoneImage)} sizes="(max-width: 768px) 100vw, 50vw" />
                      <img src={getDefaultSrc(zoneImage, 800)} alt={zoneImage.alt} loading="lazy" className="w-full h-auto" />
                    </picture>
                  </div>
                );
              })()}
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
                { name: 'Sainte-Gemmes-sur-Loire', href: '/paysagiste-sainte-gemmes-sur-loire/' },
                { name: 'Montreuil-Juigné', href: '/paysagiste-montreuil-juigne/' },
                { name: 'Saint-Jean-de-Linières', href: '/paysagiste-saint-jean-de-linieres/' },
                { name: 'Briollay', href: '/paysagiste-briollay/' },
                { name: 'Savennières', href: '/paysagiste-savennieres/' },
                { name: 'Saint-Sylvain-d\'Anjou', href: '/paysagiste-saint-sylvain-anjou/' },
                { name: 'Loire-Authion', href: '/paysagiste-loire-authion/' },
                { name: 'Longuenée-en-Anjou', href: '/paysagiste-longuenee-en-anjou/' },
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
        <img src="/images/realisations/creation-7-1200w.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
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

const services: { title: string; description: string; href: string; imageSlug: string; badge?: string }[] = [
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
    badge: 'Crédit d\'impôt 50 %',
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
