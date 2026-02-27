import { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { HeroSection } from '@/components/ui/HeroSection';
import { IconPhone, IconEmail, IconZone30km, IconHoraires, IconCheck } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Contact - Devis Gratuit',
  description:
    'Contactez Art des Jardins pour un devis gratuit. Paysagiste, entretien de jardin, élagage, abattage à Angers et environs. Réponse sous 48h.',
  alternates: {
    canonical: '/contact/',
  },
  openGraph: {
    title: 'Contact Art des Jardins - Devis Gratuit',
    description: 'Demandez un devis gratuit pour vos travaux de jardinage à Angers.',
    type: 'website',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Art des Jardins - Paysagiste Angers' }],
  },
};

const contactInfo = [
  {
    icon: <IconPhone className="w-6 h-6" />,
    title: 'Téléphone',
    content: '07 81 16 07 37',
    secondaryContent: '06 59 68 49 16',
    link: 'tel:+33781160737',
    secondaryLink: 'tel:+33659684916',
    description: 'Du lundi au vendredi, 8h-18h',
  },
  {
    icon: <IconEmail className="w-6 h-6" />,
    title: 'Email',
    content: 'artdesjardins49@gmail.com',
    link: 'mailto:artdesjardins49@gmail.com',
    description: 'Réponse sous 48h',
  },
  {
    icon: <IconZone30km className="w-6 h-6" />,
    title: 'Zone d\'intervention',
    content: 'Angers et 30 km autour',
    description: 'Maine-et-Loire (49)',
  },
  {
    icon: <IconHoraires className="w-6 h-6" />,
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
        subtitle="Demandez votre visite gratuite. Nous venons sur place, étudions votre projet et vous remettrons un devis détaillé sous 48h."
        overlay="strong"
      />

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              {/* Process en 3 étapes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { step: '1', title: 'Vous nous contactez', desc: 'Via ce formulaire ou par téléphone' },
                  { step: '2', title: 'Visite gratuite', desc: 'Nous venons étudier votre projet sur place' },
                  { step: '3', title: 'Devis sous 48h', desc: 'Détaillé, transparent et sans engagement' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div id="contact-form-container" className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6">Demande de visite gratuite</h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
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
                      <IconCheck className="w-5 h-5 flex-shrink-0" />
                      Devis gratuit et sans engagement
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 flex-shrink-0" />
                      Réponse sous 48h
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 flex-shrink-0" />
                      Visite sur place gratuite
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 flex-shrink-0" />
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
          <div className="rounded-xl overflow-hidden h-64 md:h-80 bg-gray-200">
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
