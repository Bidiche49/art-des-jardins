export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://art-et-jardin.fr/#organization',
    name: 'Art des Jardins',
    legalName: 'SARL Art des Jardins',
    description: 'Paysagiste professionnel a Angers et Maine-et-Loire. Creation de jardins, amenagement, entretien, elagage, abattage. 16 ans d\'experience cumulee.',
    url: 'https://art-et-jardin.fr',
    telephone: '+33781160737',
    email: 'artdesjardins49@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9 bis rue Rouget de l\'Isle',
      addressLocality: 'Les Ponts-de-Ce',
      postalCode: '49130',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 47.4264,
      longitude: -0.5256,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Angers',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Maine-et-Loire',
      },
    ],
    priceRange: '€€',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    sameAs: [],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services de paysagisme',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Amenagement de jardin',
            description: 'Conception et realisation de jardins sur mesure',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Entretien de jardin',
            description: 'Tonte, taille, desherbage et entretien regulier',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Elagage',
            description: 'Taille et elagage de tous types d\'arbres',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Abattage',
            description: 'Abattage securise d\'arbres',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
