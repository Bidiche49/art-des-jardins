import { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { HeroSection } from '@/components/ui/HeroSection';

export const metadata: Metadata = {
  title: 'Contact - Devis Gratuit',
  description:
    'Contactez Art des Jardins pour un devis gratuit. Paysagiste, entretien de jardin, élagage, abattage à Angers et environs. Réponse sous 48h.',
  openGraph: {
    title: 'Contact Art des Jardins - Devis Gratuit',
    description: 'Demandez un devis gratuit pour vos travaux de jardinage à Angers.',
    type: 'website',
  },
};

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    title: 'Téléphone',
    content: '07 81 16 07 37',
    secondaryContent: '06 59 68 49 16',
    link: 'tel:+33781160737',
    secondaryLink: 'tel:+33659684916',
    description: 'Du lundi au vendredi, 8h-18h',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Email',
    content: 'artdesjardins49@gmail.com',
    link: 'mailto:artdesjardins49@gmail.com',
    description: 'Réponse sous 48h',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: 'Zone d\'intervention',
    content: 'Angers et 30 km autour',
    description: 'Maine-et-Loire (49)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Horaires',
    content: 'Lun-Ven: 8h-18h',
    description: 'Sam: sur rendez-vous',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        imageSlug="terrasse-2"
        title="Contactez-nous"
        subtitle="Besoin d'un devis ou d'un conseil ? Remplissez le formulaire ci-dessous ou contactez-nous directement. Réponse garantie sous 48h."
        overlay="strong"
      />

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6">Demande de devis gratuit</h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Cards */}
                <div className="space-y-4">
                  {contactInfo.map((info, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{info.title}</h3>
                          {info.link ? (
                            <div className="flex flex-wrap items-center gap-x-2">
                              <a
                                href={info.link}
                                className="text-primary-600 hover:text-primary-800 font-medium"
                              >
                                {info.content}
                              </a>
                              {info.secondaryLink && (
                                <>
                                  <span className="text-gray-400">|</span>
                                  <a
                                    href={info.secondaryLink}
                                    className="text-primary-600 hover:text-primary-800 font-medium"
                                  >
                                    {info.secondaryContent}
                                  </a>
                                </>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-900 font-medium">{info.content}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Urgence Card */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="font-bold text-red-800 mb-2">Urgence ?</h3>
                  <p className="text-red-700 text-sm mb-4">
                    Arbre dangereux, dégâts de tempête ? Appelez-nous directement.
                  </p>
                  <a
                    href="tel:+33781160737"
                    className="block w-full text-center bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Appeler l'urgence
                  </a>
                </div>

                {/* Guarantee Card */}
                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="font-bold text-primary-800 mb-4">Notre engagement</h3>
                  <ul className="space-y-3 text-primary-700 text-sm">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Devis gratuit et sans engagement
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Réponse sous 48h
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Visite sur place gratuite
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Entreprise assurée
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-100">
        <div className="container-custom py-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Notre zone d&apos;intervention</h2>
          <div className="rounded-xl overflow-hidden h-80">
            <iframe
              src="https://maps.google.com/maps?q=9+bis+rue+Rouget+de+l%27Isle,+49130+Les+Ponts-de-C%C3%A9&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Art des Jardins - Les Ponts-de-Cé, Angers"
            />
          </div>
          <p className="text-center text-gray-600 mt-4 text-sm">
            Angers et environs (30 km) - Maine-et-Loire (49)
          </p>
        </div>
      </section>
    </>
  );
}
