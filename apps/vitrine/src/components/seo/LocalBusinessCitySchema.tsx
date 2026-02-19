interface LocalBusinessCitySchemaProps {
  city: string;
  postalCode: string;
  service: string;
  serviceDescription: string;
  url: string;
}

export function LocalBusinessCitySchema({
  city,
  postalCode,
  service,
  serviceDescription,
  url,
}: LocalBusinessCitySchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}#localbusiness`,
    name: 'Art des Jardins',
    description: `${service} à ${city}. ${serviceDescription}`,
    url,
    telephone: '+33781160737',
    email: 'artdesjardins49@gmail.com',
    image: 'https://art-et-jardin.fr/images/og-image.jpg',
    logo: 'https://art-et-jardin.fr/images/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9 bis rue Rouget de l\'Isle',
      addressLocality: city,
      postalCode,
      addressRegion: 'Maine-et-Loire',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 47.4264,
      longitude: -0.5256,
    },
    areaServed: {
      '@type': 'City',
      name: city,
    },
    priceRange: '€€',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
