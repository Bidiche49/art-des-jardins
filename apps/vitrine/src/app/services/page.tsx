import { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/lib/services-data';
import { ServiceSchema } from '@/components/seo/ServiceSchema';

export const metadata: Metadata = {
  title: 'Nos Services de Paysagisme',
  description:
    'Decouvrez tous nos services de paysagisme a Angers : amenagement de jardin, entretien, elagage, abattage. Professionnels qualifies, devis gratuit.',
  openGraph: {
    title: 'Services Paysagiste Angers | Art des Jardins',
    description: 'Amenagement, entretien, elagage, abattage - Tous nos services de paysagisme',
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServiceSchema
        name="Services de paysagisme Art des Jardins"
        description="Entreprise de paysagisme proposant amenagement de jardin, entretien, elagage et abattage a Angers et environs."
        url="https://art-et-jardin.fr/services/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Services</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Art des Jardins vous accompagne dans tous vos projets d'espaces verts. De la conception a
            l'entretien, decouvrez nos prestations professionnelles.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}/`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{service.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{service.heroSubtitle}</p>
                    <ul className="space-y-2 text-sm text-gray-500">
                      {service.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-primary-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center mt-4 text-primary-600 font-medium group-hover:gap-2 transition-all">
                      En savoir plus
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'un conseil ?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Vous ne savez pas quel service correspond a votre besoin ? Contactez-nous pour un
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
