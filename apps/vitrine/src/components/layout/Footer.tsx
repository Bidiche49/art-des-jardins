import Link from 'next/link';

function LeafIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leaf-footer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      <path
        d="M16 2C10 2 4 8 4 16c0 2 .5 4 1.5 5.5C7 18 10 14 16 12c-4 4-6 8-6.5 12.5C11 27 13.5 28 16 28c8 0 12-8 12-16C28 6 22 2 16 2z"
        fill="url(#leaf-footer)"
      />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pb-[72px] md:pb-0">
      <div className="container-custom py-10 md:py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <LeafIcon />
              <span className="text-xl font-bold text-white">Art des Jardins</span>
            </div>
            <p className="text-gray-400 mb-4">
              Paysagiste professionnel à Angers et environs. Création de jardins, entretien, élagage et abattage. Approche sur mesure, qualité artisanale.
            </p>
            <div className="text-gray-400 space-y-2">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                9 bis rue Rouget de l'Isle, 49130 Les Ponts-de-Ce
              </p>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div className="flex items-center">
                  <a href="tel:+33781160737" className="hover:text-white transition-colors">07 81 16 07 37</a>
                  <span className="mx-1.5 text-gray-600">|</span>
                  <a href="tel:+33659684916" className="hover:text-white transition-colors">06 59 68 49 16</a>
                </div>
              </div>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:artdesjardins49@gmail.com" className="hover:text-white transition-colors">artdesjardins49@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Nav columns: 2 cols on mobile, integrated in 4-col grid on md+ */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-3 md:mb-4">Services</h3>
              <ul className="space-y-1 md:space-y-2">
                <li>
                  <Link href="/paysagiste-angers" className="block py-1.5 md:py-0 hover:text-white transition-colors">
                    Paysagiste Angers
                  </Link>
                </li>
                <li>
                  <Link href="/entretien-jardin-angers" className="block py-1.5 md:py-0 hover:text-white transition-colors">
                    Entretien jardin
                  </Link>
                </li>
                <li>
                  <Link href="/elagage-angers" className="block py-1.5 md:py-0 hover:text-white transition-colors">
                    Élagage Angers
                  </Link>
                </li>
                <li>
                  <Link href="/abattage-angers" className="block py-1.5 md:py-0 hover:text-white transition-colors">
                    Abattage
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-3 md:mb-4">Informations</h3>
              <ul className="space-y-1 md:space-y-2">
                <li>
                  <Link href="/a-propos" className="block py-1.5 md:py-0 hover:text-white transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/mentions-legales" className="block py-1.5 md:py-0 hover:text-white transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/politique-confidentialite" className="block py-1.5 md:py-0 hover:text-white transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/conseils" className="block py-1.5 md:py-0 hover:text-white transition-colors">
                    Conseils jardinage
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="block py-1.5 md:py-0 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 space-y-1">
          <p>&copy; {currentYear} SARL Art des Jardins. Tous droits réservés.</p>
          <p className="text-xs text-gray-600">SARL Art des Jardins - SIRET 123 456 789 00012 - RCS Angers</p>
        </div>
      </div>
    </footer>
  );
}
