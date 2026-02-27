export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://art-et-jardin.fr/#organization',
    name: 'Art des Jardins',
    legalName: 'SARL Art des Jardins',
    description: 'Paysagiste professionnel à Angers et Maine-et-Loire. Création de jardins, aménagement, entretien, élagage, abattage. 16 ans d\'expérience cumulée.',
    url: 'https://art-et-jardin.fr',
    image: 'https://art-et-jardin.fr/images/og-image.jpg',
    logo: 'https://art-et-jardin.fr/images/logo.png',
    foundingDate: '2026',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 2,
    },
    knowsLanguage: 'French',
    paymentAccepted: ['Cash', 'Check', 'Bank Transfer'],
    currenciesAccepted: 'EUR',
    telephone: '+33781160737',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+33781160737',
        contactType: 'customer service',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+33659684916',
        contactType: 'customer service',
      },
    ],
    email: 'artdesjardins49@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9 bis rue Rouget de l\'Isle',
      addressLocality: 'Les Ponts-de-Cé',
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
    hasMap: 'https://maps.google.com/maps?q=9+bis+rue+Rouget+de+l%27Isle,+49130+Les+Ponts-de-C%C3%A9',
    identifier: {
      '@type': 'PropertyValue',
      name: 'SIRET',
      value: '999 636 806 00013',
    },
    sameAs: [
      'https://www.instagram.com/artdesjardins_49',
      // TODO: Ajouter les autres URLs réelles des profils
      // 'https://www.google.com/maps/place/Art+des+Jardins/...',
      // 'https://www.pagesjaunes.fr/pros/...',
      // 'https://www.facebook.com/artdesjardins49/',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services d\'aménagement paysager',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Aménagement de jardin',
            description: 'Conception et réalisation de jardins sur mesure',
          },
          priceRange: 'Sur devis',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Entretien de jardin',
            description: 'Tonte, taille, désherbage et entretien régulier',
          },
          priceRange: 'Sur devis',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Élagage',
            description: 'Taille et élagage de tous types d\'arbres',
          },
          priceRange: 'Sur devis',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Abattage',
            description: 'Abattage sécurisé d\'arbres',
          },
          priceRange: 'Sur devis',
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
