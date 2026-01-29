import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocalBusinessCitySchema } from '@/components/seo/LocalBusinessCitySchema';
import { cities, serviceTypes, getCityBySlug, getServiceBySlugSeo } from '@/lib/cities-data';

interface PageProps {
  params: { serviceCity: string };
}

// Parse service-city slug (e.g., "paysagiste-avrille" -> { service: "paysagiste", city: "avrille" })
function parseServiceCitySlug(slug: string): { service: string; city: string } | null {
  // Skip main Angers pages (handled by dedicated pages)
  const mainPages = ['paysagiste-angers', 'elagage-angers', 'entretien-jardin-angers', 'abattage-angers'];
  if (mainPages.includes(slug)) {
    return null;
  }

  for (const serviceType of serviceTypes) {
    const prefix = `${serviceType.service}-`;
    if (slug.startsWith(prefix)) {
      const citySlug = slug.replace(prefix, '');
      if (cities.some((c) => c.slug === citySlug)) {
        return { service: serviceType.service, city: citySlug };
      }
    }
  }
  return null;
}

export async function generateStaticParams() {
  const params: { serviceCity: string }[] = [];

  for (const service of serviceTypes) {
    for (const city of cities) {
      // Skip Angers (handled by dedicated pages)
      if (city.slug === 'angers') continue;
      params.push({ serviceCity: `${service.service}-${city.slug}` });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const parsed = parseServiceCitySlug(params.serviceCity);
  if (!parsed) return {};

  const service = getServiceBySlugSeo(parsed.service);
  const city = getCityBySlug(parsed.city);
  if (!service || !city) return {};

  const title = service.metaTitleTemplate.replace('{city}', city.name);
  const description = service.metaDescriptionTemplate.replace('{city}', city.name);

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
  };
}

export default function ServiceCityPage({ params }: PageProps) {
  const parsed = parseServiceCitySlug(params.serviceCity);
  if (!parsed) notFound();

  const service = getServiceBySlugSeo(parsed.service);
  const city = getCityBySlug(parsed.city);
  if (!service || !city) notFound();

  const pageTitle = `${service.serviceTitle} a ${city.name}`;
  const mainAngersPage = `/${service.service}-angers/`;

  return (
    <>
      <LocalBusinessCitySchema
        city={city.name}
        postalCode={city.postalCode}
        service={service.serviceTitle}
        serviceDescription={service.serviceDescription}
        url={`https://art-et-jardin.fr/${params.serviceCity}/`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom">
          <nav className="text-primary-200 text-sm mb-4">
            <Link href="/" className="hover:text-white">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <Link href={mainAngersPage} className="hover:text-white">
              {service.serviceTitle} Angers
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{city.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{pageTitle}</h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl">
            Art & Jardin, votre specialiste {service.serviceDescription} a {city.name}.
            {city.distance && ` A seulement ${city.distance} d'Angers.`} Devis gratuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Demander un devis gratuit
            </Link>
            <a
              href="tel:+33600000000"
              className="btn-secondary border-white text-white hover:bg-white/10"
            >
              Appeler : 06 XX XX XX XX
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                {service.serviceTitle} professionnel a {city.name}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Vous recherchez un <strong>{service.serviceTitle.toLowerCase()} a {city.name}</strong> ?
                  Art & Jardin intervient regulierement dans votre commune pour tous vos besoins en
                  {' '}{service.serviceDescription}.
                </p>
                <p>{city.description}</p>
                <p>{city.specificContent}</p>
                {city.neighborhoods && city.neighborhoods.length > 0 && (
                  <p>
                    Nous intervenons dans tous les quartiers de {city.name} : {city.neighborhoods.join(', ')}.
                  </p>
                )}
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Nos prestations a {city.name}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Pourquoi choisir Art & Jardin ?</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Proximite',
                    description: `Bases a Angers, nous intervenons rapidement a ${city.name}.`,
                  },
                  {
                    title: 'Experience',
                    description: 'Plus de 10 ans d\'experience dans le Maine-et-Loire.',
                  },
                  {
                    title: 'Qualite',
                    description: 'Equipements professionnels et techniques respectueuses.',
                  },
                  {
                    title: 'Garantie',
                    description: 'Entreprise assuree, devis gratuit et sans engagement.',
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-primary-800 mb-4">Informations {city.name}</h3>
                  <ul className="space-y-3 text-primary-700 text-sm">
                    <li>
                      <strong>Code postal :</strong> {city.postalCode}
                    </li>
                    <li>
                      <strong>Departement :</strong> {city.department}
                    </li>
                    {city.population && (
                      <li>
                        <strong>Population :</strong> ~{city.population} hab.
                      </li>
                    )}
                    {city.distance && (
                      <li>
                        <strong>Distance Angers :</strong> {city.distance}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold mb-2">Devis gratuit</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Intervention a {city.name} et environs.
                  </p>
                  <Link href="/contact/" className="btn-primary w-full text-center block">
                    Demander un devis
                  </Link>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Autres services</h3>
                  <ul className="space-y-2">
                    {serviceTypes
                      .filter((s) => s.service !== service.service)
                      .map((s) => (
                        <li key={s.service}>
                          <Link
                            href={`/${s.service}-${city.slug}/`}
                            className="text-primary-600 hover:text-primary-800 text-sm"
                          >
                            {s.serviceTitle} {city.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            {service.serviceTitle} dans les communes voisines
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cities
              .filter((c) => c.slug !== city.slug)
              .slice(0, 10)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/${service.service}-${c.slug}/`}
                  className="block p-4 bg-white rounded-lg hover:bg-primary-50 transition-colors text-center shadow-sm"
                >
                  <span className="font-medium text-gray-900">
                    {service.serviceTitle} {c.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">{pageTitle}</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Contactez Art & Jardin pour un devis gratuit et sans engagement.
            Intervention rapide a {city.name}.
          </p>
          <Link href="/contact/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
