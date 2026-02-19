import Link from 'next/link';
import Image from 'next/image';
import { IconPin, IconPhone, IconEmail } from '@/lib/icons';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pb-[72px] md:pb-0">
      <div className="container-custom py-10 md:py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/logo-leaf.png"
                alt=""
                width={40}
                height={26}
                className="h-7 w-auto brightness-110"
              />
              <span className="text-xl font-bold text-white font-serif">Art des Jardins</span>
            </div>
            <p className="text-gray-400 mb-4">
              Paysagiste professionnel à Angers et environs. Création de jardins, entretien, élagage et abattage. Approche sur mesure, qualité artisanale.
            </p>
            <div className="text-gray-400 space-y-2">
              <p className="flex items-center gap-2">
                <IconPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                9 bis rue Rouget de l'Isle, 49130 Les Ponts-de-Ce
              </p>
              <div className="flex items-start gap-2">
                <IconPhone className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="flex items-center">
                  <a href="tel:+33781160737" className="hover:text-white transition-colors">07 81 16 07 37</a>
                  <span className="mx-1.5 text-gray-600">|</span>
                  <a href="tel:+33659684916" className="hover:text-white transition-colors">06 59 68 49 16</a>
                </div>
              </div>
              <p className="flex items-center gap-2">
                <IconEmail className="w-4 h-4 text-primary-500 flex-shrink-0" />
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
