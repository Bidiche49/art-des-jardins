import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold text-white">Art des Jardins</span>
            </div>
            <p className="text-gray-400 mb-4">
              Paysagiste professionnel a Angers et environs. Creation de jardins, entretien, elagage et abattage. Approche sur mesure, qualite artisanale.
            </p>
            <p className="text-gray-400">
              📍 9 bis rue Rouget de l'Isle, 49130 Les Ponts-de-Ce
              <br />
              📞 <a href="tel:+33781160737" className="hover:text-white transition-colors">07 81 16 07 37</a>
              <br />
              ✉️ <a href="mailto:artdesjardins49@gmail.com" className="hover:text-white transition-colors">artdesjardins49@gmail.com</a>
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/paysagiste-angers" className="hover:text-white transition-colors">
                  Paysagiste Angers
                </Link>
              </li>
              <li>
                <Link href="/entretien-jardin-angers" className="hover:text-white transition-colors">
                  Entretien jardin
                </Link>
              </li>
              <li>
                <Link href="/elagage-angers" className="hover:text-white transition-colors">
                  Elagage Angers
                </Link>
              </li>
              <li>
                <Link href="/abattage-angers" className="hover:text-white transition-colors">
                  Abattage
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mentions-legales" className="hover:text-white transition-colors">
                  Mentions legales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
                  Confidentialite
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} SARL Art des Jardins. Tous droits reserves.</p>
        </div>
      </div>
    </footer>
  );
}
