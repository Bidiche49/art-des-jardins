import Link from 'next/link';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { Testimonials } from '@/components/Testimonials';

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Votre paysagiste a Angers
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Amenagement de jardins, entretien, elagage et abattage. Devis gratuit sous 48h.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
                Demander un devis gratuit
              </Link>
              <Link href="/services" className="btn-secondary border-white text-white hover:bg-white/10">
                Nos services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nos services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services/" className="btn-secondary">
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pret a transformer votre jardin ?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
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
    icon: '🌳',
    title: 'Paysagisme',
    description: 'Conception et amenagement de jardins sur mesure.',
    href: '/services/paysagisme/',
  },
  {
    icon: '✂️',
    title: 'Entretien',
    description: 'Tonte, taille, desherbage et entretien regulier.',
    href: '/services/entretien-jardin/',
  },
  {
    icon: '🪓',
    title: 'Elagage',
    description: 'Taille et elagage de tous types d\'arbres.',
    href: '/services/elagage/',
  },
  {
    icon: '🌲',
    title: 'Abattage',
    description: 'Abattage securise d\'arbres dangereux ou genants.',
    href: '/services/abattage/',
  },
];
