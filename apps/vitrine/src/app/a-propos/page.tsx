import { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/ui/HeroSection';
import { IconQualite, IconEquipe, IconEcologie, IconTransparence } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'À propos - Art des Jardins | Paysagiste Angers',
  description:
    'Découvrez Art des Jardins, entreprise de paysage à Angers. Deux associés passionnés, 16 ans d\'expérience cumulée. Notre histoire, notre équipe, nos valeurs.',
  openGraph: {
    title: 'À propos - Art des Jardins',
    description: 'Notre histoire, notre équipe de paysagistes à Angers.',
    type: 'website',
  },
};

const team = [
  {
    name: 'Associé fondateur',
    role: 'Gérant & Paysagiste',
    bio: 'Passionné par l\'aménagement paysager depuis plus de 10 ans, il supervise la conception des projets et la relation client. Son expertise couvre la création de jardins, le choix des végétaux et la gestion de chantier.',
    initials: 'AF',
  },
  {
    name: 'Associé fondateur',
    role: 'Responsable technique & Élagueur',
    bio: 'Spécialiste de l\'élagage et des travaux en hauteur, il dirige les interventions techniques sur le terrain. Certifié pour le travail en hauteur et l\'utilisation de nacelles, il garantit la sécurité de chaque chantier.',
    initials: 'AF',
  },
];

const values = [
  {
    title: 'Qualité artisanale',
    description:
      'Chaque jardin est un projet unique. Nous apportons le même soin et la même attention aux détails qu\'un artisan apporte à son ouvrage.',
    icon: <IconQualite className="w-8 h-8" />,
  },
  {
    title: 'Proximité & confiance',
    description:
      'Basés aux Ponts-de-Cé, nous sommes vos voisins. Nous construisons une relation de confiance avec chaque client, sur la durée.',
    icon: <IconEquipe className="w-8 h-8" />,
  },
  {
    title: 'Respect de l\'environnement',
    description:
      'Nous privilégions les techniques durables : désherbage écologique, valorisation des déchets verts, choix de végétaux locaux.',
    icon: <IconEcologie className="w-8 h-8" />,
  },
  {
    title: 'Transparence',
    description:
      'Devis détaillés, pas de mauvaise surprise. Nous vous accompagnons à chaque étape et vous tenons informés de l\'avancement.',
    icon: <IconTransparence className="w-8 h-8" />,
  },
];

const stats = [
  { value: '16+', label: 'Années d\'expérience cumulée' },
  { value: '500+', label: 'Projets réalisés' },
  { value: '4.8/5', label: 'Satisfaction client' },
  { value: '30 km', label: 'Zone d\'intervention' },
];

export default function AProposPage() {
  const personSchemas = team.map((member, i) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    worksFor: {
      '@type': 'Organization',
      name: 'Art des Jardins',
      url: 'https://art-et-jardin.fr',
    },
    description: member.bio,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchemas) }}
      />

      {/* Hero */}
      <HeroSection
        imageSlug="creation-2"
        title="À propos d'Art des Jardins"
        subtitle="Deux passionnés du paysage au service de votre jardin depuis 2024."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'À propos' },
        ]}
      />

      {/* Histoire */}
      <section className="py-16 lg:py-24">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Notre histoire</h2>
          <div className="prose prose-lg text-gray-600 mx-auto">
            <p>
              <strong>Art des Jardins</strong> est née de la rencontre de deux passionnés du paysage,
              cumulant plus de 16 ans d&apos;expérience dans l&apos;aménagement et l&apos;entretien
              d&apos;espaces verts. Installés aux Ponts-de-Cé, aux portes d&apos;Angers, nous avons
              fondé notre entreprise avec une conviction : offrir un service de qualité artisanale,
              proche de nos clients.
            </p>
            <p>
              Après des années d&apos;expérience dans des entreprises de paysage du Maine-et-Loire,
              nous avons voulu créer une structure à taille humaine, où la qualité du travail et la
              satisfaction client passent avant tout. Chaque projet est pour nous l&apos;occasion de
              mettre notre savoir-faire au service de votre jardin.
            </p>
            <p>
              Aujourd&apos;hui, Art des Jardins intervient dans toute l&apos;agglomération d&apos;Angers
              et au-delà, dans un rayon de 30 km. De la création de jardin à l&apos;élagage en passant
              par l&apos;entretien régulier, nous sommes votre interlocuteur unique pour tous vos besoins
              en espaces verts.
            </p>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Notre équipe</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Une équipe soudée de professionnels passionnés, à votre service pour tous vos projets
            d&apos;espaces verts.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-3xl font-bold text-primary-600">{member.initials}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-primary-600 font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Nos valeurs</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Ce qui guide notre travail au quotidien.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-primary-600 mb-4">{value.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <img src="/images/realisations/creation-7-1200w.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay-strong" />
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Envie de nous confier votre projet ?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Contactez-nous pour un devis gratuit et sans engagement.
          </p>
          <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
