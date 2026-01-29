interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  image?: string;
  url: string;
}

export function ServiceSchema({
  name,
  description,
  provider = 'Art & Jardin',
  areaServed = 'Angers, Maine-et-Loire',
  image,
  url,
}: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'LocalBusiness',
      name: provider,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Angers',
        postalCode: '49000',
        addressCountry: 'FR',
      },
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: areaServed,
    },
    ...(image && { image }),
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
